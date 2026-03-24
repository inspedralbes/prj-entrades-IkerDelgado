<?php

namespace Database\Seeders;

use App\Models\Seat;
use Illuminate\Database\Seeder;

class SeatSeeder extends Seeder
{
    public function run(): void
    {
        // Netegem la taula primer si cal
        Seat::truncate();

        $seats = [];

        for ($row = 1; $row <= 10; $row++) {
            for ($num = 1; $num <= 10; $num++) {
                $seats[] = [
                    'row_number' => $row,
                    'seat_number' => $num,
                ];
            }
        }

        Seat::insert($seats); // Inserció massiva per rendiment
    }
}
