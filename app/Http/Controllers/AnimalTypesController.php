<?php

namespace App\Http\Controllers;
use App\AnimalTypes;
use Illuminate\Http\Request;

class AnimalTypesController extends Controller
{
     /**
     * Action que passa os dados dos tipos de animais para o front-end
     */
    public function viewAnimalTypes()
    {
        //variavel que vai passar os dados dos animais
        $animaltypes = AnimalTypes::all();

        // Retorna todos os dados dos tipos de animais dentro do Json
        return $animaltypes->toJson();
    }
}
