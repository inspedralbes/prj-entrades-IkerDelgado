<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = ['row_number', 'seat_number'];

    public $timestamps = false; // Normalment no calen per a una plantilla fixa

    public function statuses(): HasMany
    {
        return $this->hasMany(SeatStatus::class);
    }
}
