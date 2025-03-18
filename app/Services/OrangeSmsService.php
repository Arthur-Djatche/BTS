<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class OrangeSmsService
{
    protected $client;
    protected $token;

    public function __construct()
    {
        $this->client = new Client();
    }

    // 🔥 1. Récupérer le token d’authentification
    public function getAccessToken()
    {
        try {
            $response = $this->client->post(config('services.orange_sms.api_url'), [
                'auth' => [
                    config('services.orange_sms.client_id'),
                    config('services.orange_sms.client_secret'),
                ],
                'form_params' => ['grant_type' => 'client_credentials'],
            ]);

            $data = json_decode($response->getBody(), true);
            return $data['access_token'] ?? null;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération du token : " . $e->getMessage());
            return null;
        }
    }

    // 🔥 2. Envoyer un SMS
    public function sendSms($recipient, $message)
    {
        $this->token = $this->getAccessToken();
        if (!$this->token) {
            return ['error' => 'Impossible de récupérer le token.'];
        }

        try {
            $sender = config('services.orange_sms.sender');

            $response = $this->client->post(str_replace("{sender}", $sender, config('services.orange_sms.sms_url')), [
                'headers' => [
                    'Authorization' => "Bearer " . $this->token,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'outboundSMSMessageRequest' => [
                        'address' => "tel:+$recipient",
                        'senderAddress' => "tel:+$sender",
                        'outboundSMSTextMessage' => ['message' => $message],
                    ],
                ],
            ]);

            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            Log::error("❌ Erreur lors de l'envoi du SMS : " . $e->getMessage());
            return ['error' => 'Échec de l’envoi du SMS', 'message' => $e->getMessage()];
        }
    }
}
