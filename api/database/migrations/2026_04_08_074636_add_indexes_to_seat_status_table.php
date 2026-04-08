<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('seat_status', function (Blueprint $table) {
            // Unicitat: Un seient només pot tenir un estat per sessió
            $table->unique(['session_id', 'seat_id'], 'unique_seat_per_session');
            
            // Índexs per a cerca ràpida i expiació de reserves
            $table->index('status');
            $table->index('locked_at');
            $table->index(['session_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seat_status', function (Blueprint $table) {
            $table->dropUnique('unique_seat_per_session');
            $table->dropIndex(['status']);
            $table->dropIndex(['locked_at']);
            $table->dropIndex(['session_id', 'status']);
        });
    }
};
