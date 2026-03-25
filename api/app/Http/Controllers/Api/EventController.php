<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Http\Resources\EventResource;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::withCount('sessions')->get();
        return EventResource::collection($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $event = Event::create($validated);
        return new EventResource($event);
    }

    public function show($id)
    {
        $event = Event::with('sessions')->findOrFail($id);
        return new EventResource($event);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $event->update($validated);
        return new EventResource($event);
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event eliminat correctament']);
    }
}
