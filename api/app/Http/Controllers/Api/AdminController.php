<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\SeatStatus;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function stats()
    {
        $totalRevenue = DB::table('seat_status')
            ->join('seats', 'seat_status.seat_id', '=', 'seats.id')
            ->where('seat_status.status', 'sold')
            ->sum('seats.price');

        $totalTicketsSold = SeatStatus::where('status', 'sold')->count();
        $activeLocks = SeatStatus::where('status', 'locked')->count();
        
        $totalSeats = SeatStatus::count();
        $occupancyRate = $totalSeats > 0 ? ($totalTicketsSold / $totalSeats) * 100 : 0;

        return response()->json([
            'total_revenue' => $totalRevenue,
            'tickets_sold' => $totalTicketsSold,
            'active_locks' => $activeLocks,
            'occupancy_rate' => round($occupancyRate, 2),
            'total_events' => Event::count(),
            'total_sessions' => Session::count()
        ]);
    }
}
