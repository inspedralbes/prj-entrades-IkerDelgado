<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Seat;
use App\Models\SeatStatus;
use App\Http\Resources\SessionResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SessionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'date_time' => 'required|date',
            'venue' => 'required|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            // 1. Crear la sessió
            $session = Session::create([
                'event_id' => $validated['event_id'],
                'date_time' => Carbon::parse($validated['date_time']),
                'venue' => $validated['venue'],
            ]);

            // 2. Obtenir tots els seients plantilla
            $seats = Seat::all();

            // 3. Generar la disponibilitat massiva per a aquesta sessió
            $seatStatuses = $seats->map(function ($seat) use ($session) {
                return [
                    'session_id' => $session->id,
                    'seat_id' => $seat->id,
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            SeatStatus::insert($seatStatuses); // Inserció ràpida en un sol bloc

            return new SessionResource($session);
        });
    }

    public function show($id)
    {
        $session = Session::with('event')->findOrFail($id);
        return new SessionResource($session);
    }
}
