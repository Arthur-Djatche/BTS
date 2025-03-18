<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use App\Services\OrangeSmsService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    // public function register(): void
    // {
    //     //
    // }

    public function register()
{
    $this->app->singleton(OrangeSmsService::class, function ($app) {
        return new OrangeSmsService();
    });
}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Enregistrement du middleware "role"
        Route::aliasMiddleware('role', \App\Http\Middleware\CheckRole::class);
    }

    
}
