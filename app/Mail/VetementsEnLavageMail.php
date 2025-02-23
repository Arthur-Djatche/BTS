<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VetementsEnLavageMail extends Mailable
{
    use Queueable, SerializesModels;

    public $lavage;

    /**
     * Create a new message instance.
     *
     * @param  mixed  $lavage
     */
    public function __construct($lavage)
    {
        $this->lavage = $lavage;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->subject('Vos vêtements mis en Lavage !')
                ->view('mail.VetementsEnLavage')->with('lavage', $this->lavage);
    }
}
