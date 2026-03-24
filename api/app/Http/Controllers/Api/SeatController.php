<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeatStatus;
use App\Http\Resources\SeatStatusResource;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:sessions,id',
        ]);

        $statuses = SeatStatus::with('seat')
            ->where('session_id', $request->session_id)
            ->get();

        return SeatStatusResource::collection($statuses);
    }
}
