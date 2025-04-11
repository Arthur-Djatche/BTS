<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetOtp extends Model
{
    protected $fillable = [
        'identifier',
        'otp',
        'expires_at',
    ];


    public $timestamps = true;
}
