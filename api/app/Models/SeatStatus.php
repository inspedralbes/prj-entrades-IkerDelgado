<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeatStatus extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'seat_status';

    protected $fillable = [
        'session_id', 
        'seat_id', 
        'user_id', 
        'order_id', 
        'status', 
        'locked_at'
    ];

    protected $casts = [
        'locked_at' => 'datetime',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
