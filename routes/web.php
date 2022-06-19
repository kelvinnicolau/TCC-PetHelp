<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/','HomeController@ViewHome')->name('pages.home');

// Points

Route::post('/points/create','PointsController@create');

Route::post('/points/read','HomeController@read');

Route::post('/points/update','PointsController@update');

Route::post('/points/delete','PointsController@delete');

// Tipos de Pontos

Route::post('/points-types/read-types','PointTypesController@viewPointsTypes');

// Tipos de Animais

Route::post('/animal-types/read-animal','AnimalTypesController@viewAnimalTypes');

// Servir imagens
Route::get('/storage/{folder}/{filename}', function ($folder, $filename)
{
    //return 'public/' . $folder . '/' . $filename;
    $path = storage_path('app/' . $folder . '/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

// Logout
Route::get('/sair', 'Auth\LoginController@logout');