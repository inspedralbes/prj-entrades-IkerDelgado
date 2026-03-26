<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeatStatusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'seat_id' => $this->seat_id,
            'row' => $this->seat->row_number,
            'number' => $this->seat->seat_number,
            'price' => $this->seat->price, // Enviem el preu a la vista
            'status' => $this->status,
            'locked_at' => $this->locked_at ? $this->locked_at->toIso8601String() : null,
        ];
    }
}
