<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->string('row_number');
            $table->integer('seat_number');
            $table->decimal('price', 8, 2)->default(25.00);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
