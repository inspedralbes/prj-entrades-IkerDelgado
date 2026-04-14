<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Session;
use App\Models\Seat;
use App\Models\SeatStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // Netegem dades anteriors per evitar duplicats i conflictes
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Event::truncate();
        Session::truncate();
        SeatStatus::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $events = [
            [
                'title' => 'MOTOMAMI WORLD TOUR',
                'artist' => 'Rosalía',
                'image' => 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop',
                'description' => 'L\'espectacle més innovador de l\'any arriba a la ciutat. Una barreja de flamenc, reggaeton i pop experimental que ha canviat les regles del joc.',
                'sessions' => [
                    ['date' => '2026-06-15 21:00:00', 'venue' => 'Palau Sant Jordi'],
                    ['date' => '2026-06-16 21:00:00', 'venue' => 'Palau Sant Jordi'],
                ]
            ],
            [
                'title' => 'MUSIC OF THE SPHERES',
                'artist' => 'Coldplay',
                'image' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
                'description' => 'Una experiència immersiva plena de llum, color i els grans èxits d\'una de les bandes més grans de la història.',
                'sessions' => [
                    ['date' => '2026-07-20 20:30:00', 'venue' => 'Estadi Olímpic'],
                    ['date' => '2026-07-21 20:30:00', 'venue' => 'Estadi Olímpic'],
                ]
            ],
            [
                'title' => 'WORLD\'S HOTTEST TOUR',
                'artist' => 'Bad Bunny',
                'image' => 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop',
                'description' => 'El "Conejo Malo" arriba per fer-nos ballar tota la nit amb el seu estil inconfusible i una posada en escena espectacular.',
                'sessions' => [
                    ['date' => '2026-08-05 22:00:00', 'venue' => 'RCDE Stadium'],
                ]
            ],
            [
                'title' => 'THE ERAS TOUR',
                'artist' => 'Taylor Swift',
                'image' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop',
                'description' => 'Un viatge a través de totes les etapes musicals de Taylor Swift en un concert de més de 3 hores que està batent tots els rècords.',
                'sessions' => [
                    ['date' => '2026-05-12 19:00:00', 'venue' => 'Santiago Bernabéu'],
                ]
            ],
            [
                'title' => 'AFTER HOURS TILL DAWN',
                'artist' => 'The Weeknd',
                'image' => 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=1000&auto=format&fit=crop',
                'description' => 'Viu la nit més fosca i brillant amb The Weeknd en un xou apocalíptic ple de sintetitzadors i veus celestials.',
                'sessions' => [
                    ['date' => '2026-09-10 21:30:00', 'venue' => 'Wanda Metropolitano'],
                ]
            ],
            [
                'title' => 'JAZZ UNDER THE STARS',
                'artist' => 'Barcelona Jazz Collective',
                'image' => 'https://images.unsplash.com/photo-1415201374777-0191818293f3?q=80&w=1000&auto=format&fit=crop',
                'description' => 'Una nit íntima i relaxada gaudint del millor jazz local sota la llum de la lluna en un entorn inigualable.',
                'sessions' => [
                    ['date' => '2026-04-30 20:00:00', 'venue' => 'Jardins de Pedralbes'],
                ]
            ],
        ];

        $allSeats = Seat::all();

        if ($allSeats->isEmpty()) {
            $this->command->warn("No hi ha seients a la base de dades. Executa primer el SeatSeeder.");
            return;
        }

        foreach ($events as $eventData) {
            $sessions = $eventData['sessions'];
            unset($eventData['sessions']);

            $event = Event::create($eventData);
            $this->command->info("Creat l'esdeveniment: {$event->title}");

            foreach ($sessions as $sessionData) {
                $session = Session::create([
                    'event_id' => $event->id,
                    'date_time' => Carbon::parse($sessionData['date']),
                    'venue' => $sessionData['venue'],
                ]);
                $this->command->comment("  - Creada la sessió a {$session->venue}");

                // Generar els SeatStatus per a cada sessió
                $statusData = $allSeats->map(function($seat) use ($session) {
                    return [
                        'session_id' => $session->id,
                        'seat_id' => $seat->id,
                        'status' => 'available'
                    ];
                })->toArray();

                SeatStatus::insert($statusData);
            }
        }
    }
}
