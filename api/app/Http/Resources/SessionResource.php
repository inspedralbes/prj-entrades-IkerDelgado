<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'event_title' => $this->whenLoaded('event', fn() => $this->event->title),
            'date_time' => $this->date_time->toIso8601String(),
            'venue' => $this->venue,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
