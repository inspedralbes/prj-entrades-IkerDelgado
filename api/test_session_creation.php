<?php

use App\Models\Event;
use App\Models\Session;
use App\Models\SeatStatus;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- TEST DE CREACIÓ DE SESSIÓ ---\n";

// 1. Busquem o creem un event de prova
$event = Event::first();
if (!$event) {
    echo "Creant event de prova...\n";
    $event = Event::create([
        'title' => 'Concert de Test',
        'artist' => 'Artista de Test',
        'venue' => 'Sala Test'
    ]);
}

echo "Event ID: {$event->id}\n";

// 2. Simulem la crida al controlador
try {
    DB::beginTransaction();
    
    $date = now()->addDays(10)->format('Y-m-d H:i:s');
    echo "Intentant crear sessió per a la data: $date...\n";

    $session = Session::create([
        'event_id' => $event->id,
        'date_time' => $date,
        'venue' => 'Local de Prova'
    ]);

    echo "Sessió creada amb ID: {$session->id}\n";

    // Mirem si hi ha seients plantilla
    $seatsCount = \App\Models\Seat::count();
    echo "Seients plantilla trobats: $seatsCount\n";

    if ($seatsCount > 0) {
        $seats = \App\Models\Seat::all();
        $seatStatuses = $seats->map(function ($seat) use ($session) {
            return [
                'session_id' => $session->id,
                'seat_id' => $seat->id,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        SeatStatus::insert($seatStatuses);
        echo "Inserits " . count($seatStatuses) . " estats de seients.\n";
    }

    $createdStatuses = SeatStatus::where('session_id', $session->id)->count();
    echo "Verificació: Hi ha $createdStatuses registres de SeatStatus per a aquesta sessió.\n";

    DB::commit();
    echo "TEST FINALITZAT AMB ÈXIT.\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "ERROR AL TEST: " . $e->getMessage() . "\n";
}
