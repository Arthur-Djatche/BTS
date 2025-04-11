<?php 

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PasswordResetOtp;
use App\Models\Acteur;
use App\Services\OrangeSmsService;
use Illuminate\Support\Facades\Log;
use App\Models\Structure;
use Inertia\Inertia;
use App\Http\Requests\PasswordResetRequest;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;



class PasswordResetController extends Controller
{
    public function sendOtp(Request $request, OrangeSmsService $smsService)
{
    $request->validate([
        'telephone' => 'required|string'
    ]);

    $identifier = $request->telephone;

    // Chercher dans acteurs (telephone ou email)
    $acteur = Acteur::where('telephone', $identifier)
                   ->orWhere('email', $identifier)
                   ->first();
    
    // Chercher dans structures (telephone ou email)
    $structure = Structure::where('telephone', $identifier)
                         ->orWhere('email', $identifier)
                         ->first();

    if (!$acteur && !$structure) {
        return back()->withErrors(['telephone' => 'Numéro de téléphone ou email incorrect.']);
    }

    $otp = rand(100000, 999999);
    $expiresAt = now()->addMinutes(10);

    PasswordResetOtp::updateOrCreate(
        ['identifier' => $identifier],
        ['otp' => $otp, 'expires_at' => $expiresAt]
    );

    // Vérifier si l'identifiant est un email
    if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
        // Envoyer l'OTP par email
        $message = "Votre code de réinitialisation est : {$otp}";
      // ✅ Envoi du mail
      Mail::to($identifier)->send(new OtpMail($otp));

    } else {
        // Envoyer l'OTP par SMS
        $message = "Votre code de réinitialisation est : {$otp}";
        $this->sendSmsSafe($smsService, $identifier, $message);
    }

        // Dans sendOtp()
    session()->put('telephone', $identifier);
    return to_route('password.verify');

}

    private function sendSmsSafe($smsService, $telephone, $message)
    {
        if (empty($telephone)) {
            Log::warning("❌ Numéro de téléphone vide, SMS non envoyé.");
            return;
        }

        try {
            $response = $smsService->sendSms($telephone, $message);
            Log::info("📤 SMS envoyé à {$telephone} : {$message}", ['response' => $response]);
        } catch (\Exception $e) {
            Log::error("❌ Erreur lors de l'envoi du SMS à {$telephone} : " . $e->getMessage());
        }
    }

    public function verifyOtp(Request $request)
{
    Log::info('Début de la vérification OTP', ['ip' => $request->ip(), 'user_agent' => $request->userAgent()]);

    try {
        // Valider les données d'entrée
        $validated = $request->validate([
            'telephone' => 'required|string',
            'otp' => 'required|numeric|digits:6',
        ]);

        Log::debug('Données validées', [
            'telephone' => $validated['telephone'],
            'otp' => $validated['otp'],
            'otp_type' => gettype($validated['otp'])
        ]);

        // Recherche de l'OTP
        $record = PasswordResetOtp::where('identifier', $validated['telephone'])->first();

        Log::debug('Enregistrement OTP trouvé', [
            'exists' => (bool)$record,
            'stored_otp' => $record ? $record->otp : null,
            'stored_otp_type' => $record ? gettype($record->otp) : null,
            'expires_at' => $record ? $record->expires_at : null,
            'current_time' => now()
        ]);

        if (!$record) {
            Log::warning('Aucun OTP trouvé pour ce numéro', ['telephone' => $validated['telephone']]);
            return back()->withErrors(['otp' => 'Aucun code OTP trouvé pour ce numéro']);
        }

        // Comparaison des OTP
        $otpMatches = (int)$record->otp === (int)$validated['otp'];
        $otpStrictMatches = $record->otp === $validated['otp'];

        Log::debug('Comparaison OTP', [
            'input_otp' => $validated['otp'],
            'stored_otp' => $record->otp,
            'matches' => $otpMatches,
            'strict_matches' => $otpStrictMatches,
            'input_type' => gettype($validated['otp']),
            'stored_type' => gettype($record->otp)
        ]);

        if (!$otpMatches) {
            Log::warning('OTP incorrect', [
                'input' => $validated['otp'],
                'stored' => $record->otp
            ]);
            return back()->withErrors(['otp' => 'Code OTP incorrect']);
        }

        // Vérification expiration
        $isExpired = now()->gt($record->expires_at);
        Log::debug('Vérification expiration', [
            'expires_at' => $record->expires_at,
            'current_time' => now(),
            'is_expired' => $isExpired
        ]);

        if ($isExpired) {
            Log::warning('OTP expiré', ['expires_at' => $record->expires_at]);
            return back()->withErrors(['otp' => 'Le code OTP a expiré']);
        }

        Log::info('OTP vérifié avec succès', ['telephone' => $validated['telephone']]);
        return Inertia::render('Auth/ResetPasswordForm', [
            'identifier' => $validated['telephone'],
            'success' => 'Code OTP validé avec succès'
        ]);

    } catch (\Exception $e) {
        Log::error('Erreur lors de la vérification OTP', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);
        return back()->withErrors(['otp' => 'Une erreur technique est survenue']);
    }
}
public function resetPassword(Request $request)
{
    $request->validate([
        'identifier' => 'required|string',
        'password' => 'required|min:6|confirmed',
    ]);

    $acteur = Acteur::where('telephone', $request->identifier)->first();
    $structure = Structure::where('telephone', $request->identifier)->first();

    if ($acteur) {
        $acteur->password = bcrypt($request->password);
        $acteur->save();
    } elseif ($structure) {
        $structure->password = bcrypt($request->password);
        $structure->save();
    } else {
        return redirect('/bienvenue')->withErrors(['identifier' => 'Identifiant non trouvé.']);
    }

    // Supprimer l’OTP utilisé
    PasswordResetOtp::where('identifier', $request->identifier)->delete();

    return redirect('/bienvenue')->with('success', 'Mot de passe réinitialisé.');
}
public function showRequestForm()
{
    return Inertia::render('Auth/RequestOtpForm');
}
public function showVerifyForm(Request $request)
{
    return Inertia::render('Auth/VerifyOtpForm', [
        'telephone' => session('telephone')
    ]);
}
}
