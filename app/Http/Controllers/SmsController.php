<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OrangeSmsService;
use Inertia\Inertia;

class SmsController extends Controller
{
    protected $smsService;

    public function __construct(OrangeSmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    // 📩 Vue Inertia pour envoyer un SMS
    public function index()
    {
        return Inertia::render('SendSms');
    }

    // 📩 Envoi du SMS
    public function sendSms(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:9',
            'message' => 'required|string|max:160',
        ]);

        $response = $this->smsService->sendSms($request->phone, $request->message);

        return Inertia::render('SendSms', [
            'status' => isset($response['error']) ? 'error' : 'success',
            'message' => $response['error'] ?? 'SMS envoyé avec succès !'
        ]);
    }
}
