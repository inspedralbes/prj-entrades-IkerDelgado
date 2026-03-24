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
            'image_url' => $this->image,
            'description' => $this->description,
            'sessions_count' => $this->whenCounted('sessions'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
