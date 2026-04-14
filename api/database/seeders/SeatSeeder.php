<?php

namespace Database\Seeders;

use App\Models\Seat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class SeatSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Seat::truncate();
        Schema::enableForeignKeyConstraints();

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
