<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use App\Points;

class PointsController extends Controller
{

    public function __construct()
    {
        // verifica login
        $this->middleware('auth:users');
    }

    // CRUD

    // create
    // Criação de um campo

    public function create(Request $request) {

        try {

            $request->validate([
                'title' => 'required|max:30',
                'description' => 'max:180',
                // 'latitude' => 'max:50',
                // 'animal_type_id' => 'required|integer',
                // 'point_type_id' => 'required|integer',
            ]);

            $point = new Points;
            $point->title = $request->title;
            $point->description = $request->description;
            $point->latitude = $request->latitude;
            $point->longitude = $request->longitude;
            $point->user_id = Auth::user()->id;
            $point->animal_types_id = $request->animal_types_id;
            $point->point_types_id = $request->point_types_id;

            if (!empty($request->image)) {
                $pasta_no_servidor = Storage::disk('local')->put('points', $request->image);
                $point->image = $pasta_no_servidor;
            }

            $point->save();
            return response($point->id, 200);

        } catch (ValidationException $ex) {
            Log::error($ex);
            return response($ex->getMessage(), 412);
        }  catch (\Exception $ex) {
            Log::error($ex);
            return response($ex->getMessage(), 500);
        }



    }

    // Update
    // Atualiza o campo que receber um novo dado, se não recebe o dado antigo

    public function update(Request $request) {

        try {

            $request->validate([
                'id' => 'required|integer',
            ]);

            $point = Points::find($request->id);
            if (!empty($point)) {

                if ($point->user_id != Auth::user()->id) {
                    return response("Esse usuário não está autorizado a realizar essa operação", 500);
                }

                $point->title = !empty($request->title) ? $request->title : $point->title;
                $point->description = !empty($request->description) ? $request->description :  $point->description;
                $point->animal_types_id = !empty($request->animal_types_id) ? $request->animal_types_id :  $point->animal_types_id;
                $point->point_types_id = !empty($request->point_types_id) ? $request->point_types_id :  $point->point_types_id;

                if (!empty($request->image)) {
                    $pasta_no_servidor = Storage::disk('local')->put('points', $request->image);
                    $point->image = $pasta_no_servidor;
                }

                $point->save();
                return response($point->id, 200);
            }

        } catch (ValidationException $ex) {
            Log::error($ex);
            return response($ex->getMessage(), 412);
        }  catch (\Exception $ex) {
            Log::error($ex);
            return response($ex->getMessage(), 500);
        }

    }

    // Delete
    // Seleciona o ponto por ID e exclui

    public function delete(Request $request) {
        try {
            $point = Points::find($request->id);
            if (!empty($point)) {
                $point->delete();
            }
        } catch (\Exception $ex) {
            Log::error($ex);
        }
    }
}
