<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SeatStatus;
use Illuminate\Support\Facades\Redis;

class UnlockExpiredSeats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seats:unlock-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Libera els seients bloquejats per més de 5 minuts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredSeats = SeatStatus::where('status', 'locked')
            ->where('locked_at', '<', now()->subMinutes(5))
            ->get();

        if ($expiredSeats->isEmpty()) {
            $this->info('No hi ha seients caducats per alliberar.');
            return;
        }

        foreach ($expiredSeats as $seat) {
            $seat->update([
                'status' => 'available',
                'user_id' => null,
                'locked_at' => null
            ]);

            // Notificar via Redis per al socket
            Redis::publish('seat-updates', json_encode([
                'event' => 'lock-expired',
                'sessionId' => $seat->session_id,
                'seatStatusId' => $seat->id
            ]));

            $this->info("Seient {$seat->id} alliberat (sessió {$seat->session_id})");
        }

        $this->info('Procés finalitzat.');
    }
}
