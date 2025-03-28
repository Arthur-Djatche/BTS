<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OrangeSmsService
{
    private $clientId;
    private $clientSecret;
    private $authHeader;
    private $senderNumber;
    private $senderName;
    private $accessToken;

    public function __construct()
    {
        $this->clientId = env('ORANGE_SMS_CLIENT_ID');
        $this->clientSecret = env('ORANGE_SMS_CLIENT_SECRET');
        $this->authHeader = env('ORANGE_SMS_AUTH_HEADER');
        $this->senderNumber = env('ORANGE_SMS_SENDER_NUMBER');
        $this->senderName = env('ORANGE_SMS_SENDER_NAME');
        $this->accessToken = $this->getAccessToken(); // Génère le token automatiquement
    }

    /**
     * 📌 Récupérer le token d'accès OAuth 2.0
     */
    private function getAccessToken()
    {
        $response = Http::withHeaders([
            'Authorization' => $this->authHeader,
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Accept' => 'application/json',
        ])->asForm()->post('https://api.orange.com/oauth/v3/token', [
            'grant_type' => 'client_credentials',
        ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        throw new \Exception("Erreur lors de la récupération du token Orange: " . $response->body());
    }

    /**
     * 📌 Envoyer un SMS via l'API Orange
     */
    public function sendSms($recipient, $message)
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer " . $this->accessToken,
            'Content-Type' => 'application/json',
        ])->post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B$this->senderNumber/requests", [
            "outboundSMSMessageRequest" => [
                "address" => "tel:+$recipient",
                "senderAddress" => "tel:+$this->senderNumber",
                "senderName" => $this->senderName,
                "outboundSMSTextMessage" => [
                    "message" => $message,
                ],
            ],
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception("Erreur lors de l'envoi du SMS: " . $response->body());
    }
}
