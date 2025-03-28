<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Lavage;
use App\Models\Vetement;
use Illuminate\Console\Command;

class CleanupOldLavages extends Command
{
    protected $signature = 'cleanup:lavages';
    protected $description = 'Supprime les lavages et vêtements ayant l\'état "Initial" depuis 3 jours';

    public function handle()
    {
        $dateLimit = Carbon::now()->subDays(3);

        // Trouver les lavages où TOUS les vêtements sont "Initial" et créés depuis +3 jours
        $lavagesASupprimer = Lavage::whereHas('vetements', function ($query) use ($dateLimit) {
            $query->where('etat', 'Initial')->where('created_at', '<', $dateLimit);
        })->withCount(['vetements as total_vetements' => function ($query) {
            $query->where('etat', '!=', 'Initial');
        }])->having('total_vetements', 0)->get();

        if ($lavagesASupprimer->isEmpty()) {
            $this->info('Aucun lavage à supprimer.');
            return;
        }

        // Supprimer les vêtements et les lavages
        foreach ($lavagesASupprimer as $lavage) {
            Vetement::where('lavage_id', $lavage->id)->delete();
            $lavage->delete();
        }

        $this->info(count($lavagesASupprimer) . ' lavages supprimés.');
    }
}
