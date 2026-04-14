<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'artist' => $this->artist,
            'image' => $this->image, // Tornem a usar 'image' per coherència
            'description' => $this->description,
            'sessions' => SessionResource::collection($this->whenLoaded('sessions')),
            'sessions_count' => $this->sessions_count,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
