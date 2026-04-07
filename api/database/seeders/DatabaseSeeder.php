<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SeatSeeder::class,
            EventSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Iker Delgado',
            'email' => 'iker@gmail.com',
            'password' => bcrypt('password123'),
            'role' => 'client',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);
    }
}
