<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeatStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class PurchaseController extends Controller
{
    public function purchase(Request $request)
    {
        $request->validate([
            'seat_status_ids' => 'required|array',
            'seat_status_ids.*' => 'exists:seat_status,id',
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($request, $user) {
            // Un seient es pot comprar si està 'available' O si està 'locked' pel mateix usuari
            $seatStatuses = SeatStatus::whereIn('id', $request->seat_status_ids)
                ->where(function ($query) use ($user) {
                    $query->where('status', 'available')
                          ->orWhere(function ($q) use ($user) {
                              $q->where('status', 'locked')
                                ->where('user_id', $user->id);
                          });
                })
                ->lockForUpdate()
                ->get();

            if ($seatStatuses->count() !== count($request->seat_status_ids)) {
                return response()->json([
                    'message' => 'Alguns dels seients ja no estan disponibles.'
                ], 422);
            }

            foreach ($seatStatuses as $status) {
                $status->update([
                    'status' => 'sold',
                    'user_id' => $user->id,
                    'locked_at' => null
                ]);

                // Notificar a tots que el seient s'ha venut
                Redis::publish('seat-updates', json_encode([
                    'event' => 'seat-purchased',
                    'sessionId' => $status->session_id,
                    'seatStatusIds' => [$status->id] // Es pot enviar array o single
                ]));
            }

            return response()->json([
                'message' => 'Compra realitzada amb èxit!',
                'count' => $seatStatuses->count()
            ]);
        });
    }
}
