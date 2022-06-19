<?php

namespace App\Http\Controllers;

use App\Points;
use App\PointTypes;
use App\AnimalTypes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function ViewHome() {
        $animalTypes = AnimalTypes::get();
        $pointTypes = PointTypes::get();
        return view('pages.home', compact('animalTypes', 'pointTypes'));
    }

    // Read
    // Procura o ponto pelo ID e apresenta ele.

    public function read(Request $request) {
        $points = Points::get();
        return $points->toJson();
    }

}
