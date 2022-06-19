<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\PointTypes;

class PointTypesController extends Controller
{
    /**
     * Action que passa os dados dos tipos de pontos
     */
    public function viewPointsTypes()
    {
        //variavel que vai passar os dados dos points
        $pointstypes = PointTypes::all();

        // Retorna todos os dados dos tipos de pontos dentro do Json
        return $pointstypes->toJson();
    }
}
