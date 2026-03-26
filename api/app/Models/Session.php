<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Session extends Model
{
    use HasFactory;

    protected $table = 'event_sessions';

    const UPDATED_AT = null;

    protected $fillable = ['event_id', 'date_time', 'venue'];

    protected $casts = [
        'date_time' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function seatStatuses(): HasMany
    {
        return $this->hasMany(SeatStatus::class);
    }
}
