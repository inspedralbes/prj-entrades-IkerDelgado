<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeatStatus;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function myTickets(Request $request)
    {
        $tickets = SeatStatus::where('user_id', $request->user()->id)
            ->where('status', 'sold')
            ->with(['session.event', 'seat'])
            ->get();

        return response()->json([
            'data' => $tickets
        ]);
    }
}
