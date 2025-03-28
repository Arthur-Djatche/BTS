<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('web')->check() && Auth::guard('web')->user()->role === 'super_admin') {
            return $next($request);
        }
        return redirect('/unauthorized'); // Redirection si l'utilisateur n'est pas super admin
    }
}
