<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeatStatus;
use App\Http\Resources\SeatStatusResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

class SeatController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:event_sessions,id',
        ]);

        $statuses = SeatStatus::with('seat')
            ->where('session_id', $request->session_id)
            ->get();

        return SeatStatusResource::collection($statuses);
    }

    public function lock(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:event_sessions,id',
            'seat_status_ids' => 'required|array',
            'seat_status_ids.*' => 'exists:seat_status,id',
        ]);

        $user = $request->user();

        // Validació de límit de seients (Requisit 5.3)
        if (count($request->seat_status_ids) > 5) {
            return response()->json(['message' => 'No pots bloquejar més de 5 seients alhora.'], 422);
        }

        return DB::transaction(function () use ($request, $user) {
            $seats = SeatStatus::whereIn('id', $request->seat_status_ids)
                ->where('session_id', $request->session_id)
                ->where('status', 'available')
                ->lockForUpdate()
                ->get();

            if ($seats->count() !== count($request->seat_status_ids)) {
                return response()->json(['message' => 'Alguns seients ja no estan disponibles.'], 422);
            }

            foreach ($seats as $seat) {
                $seat->update([
                    'status' => 'locked',
                    'user_id' => $user->id,
                    'locked_at' => now(),
                ]);

                // Notificar per Redis
                Redis::publish('seat-updates', json_encode([
                    'event' => 'seat-locked',
                    'sessionId' => $request->session_id,
                    'seatStatusId' => $seat->id,
                    'userId' => $user->id
                ]));
            }

            return response()->json(['message' => 'Seients bloquejats correctament per 5 minuts.']);
        });
    }

    public function unlock(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:event_sessions,id',
            'seat_status_ids' => 'required|array',
            'seat_status_ids.*' => 'exists:seat_status,id',
        ]);

        $user = $request->user();

        $seats = SeatStatus::whereIn('id', $request->seat_status_ids)
            ->where('session_id', $request->session_id)
            ->where('user_id', $user->id)
            ->where('status', 'locked')
            ->get();

        foreach ($seats as $seat) {
            $seat->update([
                'status' => 'available',
                'user_id' => null,
                'locked_at' => null,
            ]);

            // Notificar per Redis
            Redis::publish('seat-updates', json_encode([
                'event' => 'seat-unlocked',
                'sessionId' => $request->session_id,
                'seatStatusId' => $seat->id
            ]));
        }

        return response()->json(['message' => 'Seients desbloquejats correctament.']);
    }
}
