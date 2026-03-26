<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeatStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            $seatStatuses = SeatStatus::whereIn('id', $request->seat_status_ids)
                ->where('status', 'available')
                ->lockForUpdate() // Evita que altres compren els mateixos alhora
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
                    'locked_at' => null // Per si estigués bloquejat per socket
                ]);
            }

            return response()->json([
                'message' => 'Compra realitzada amb èxit!',
                'count' => $seatStatuses->count()
            ]);
        });
    }
}
