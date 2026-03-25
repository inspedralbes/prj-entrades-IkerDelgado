<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\SeatController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Ver conciertos y sesiones es público
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/sessions/{id}', [SessionController::class, 'show']);
Route::get('/seats', [SeatController::class, 'index']); // Ver disponibilidad

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |----------------------------------------------------------------------
    | Admin Only Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        // Gestió d'usuaris
        Route::get('/users', function () {
            return \App\Models\User::all();
        });
        Route::delete('/users/{id}', function ($id) {
            $user = \App\Models\User::findOrFail($id);
            if ($user->role === 'admin') {
                return response()->json(['message' => 'No es pot eliminar un administrador'], 403);
            }
            $user->delete();
            return response()->json(['message' => 'Usuari eliminat correctament']);
        });

        // CRUD de eventos
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);

        // Gestión de sesiones
        Route::get('/sessions', [SessionController::class, 'index']);
        Route::post('/sessions', [SessionController::class, 'store']);
        Route::put('/sessions/{id}', [SessionController::class, 'update']);
        Route::delete('/sessions/{id}', [SessionController::class, 'destroy']);
    });

});
