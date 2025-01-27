<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VetementsPretsMail extends Mailable
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
            ->subject('Vos vêtements sont prêts !')
                ->view('mail.VetementsPrets')->with('lavage', $this->lavage);
    }
}
