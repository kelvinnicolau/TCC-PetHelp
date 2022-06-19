@extends('layouts.default')

{{-- SEO da Página --}}
@section('titulo', 'Mapa')

{{-- Estilo da Página --}}
@push('stack-head-end')
	<link href="{{ url('assets/css/pages/mapa.css') }}" rel="stylesheet" type="text/css"/>
@endpush

@section('content')

<section id="mapa">
    <div class="container">
        <div class="row">
            <div class="col-xl-12 col-sm-12 text-center">
                <div id="googleMap"></div>
            </div>
        </div>
    </div>
</section>

<!-- Modal -->
<div class="modal" id="cadastro" aria-hidden="true">
    <div class="modal-cadastro">
        <div class="wrap-modal">
            <button id="btnClose" class="close-cadastro">
                <img width="15" height="15" src="{{ asset('../assets/img/close.png') }}" alt="Close">
            </button>
            <form id="form">

                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                <input type="hidden" id="id" name="id"/>
                <input type="hidden" id="latitude" name="latitude" />
                <input type="hidden" id="longitude" name="longitude" />

                <div class="wrap">
                    <label for="title">Título</label>
                    <input required name="title" id="title" type="text" class="form-control">
                </div>

                <div class="wrap">
                    <label for="description">Descrição</label>
                    <textarea required name="description" id="description" type="text" class="form-control"></textarea>
                </div>

                <div class="wrap">
                    {{-- class="btn btn-image btn-primary" --}}
                    <label for="image" >Imagem do Animal</label>
                    <input name="image" id="image" type="file"/>
                </div>

                <div class="wrap">
                    <label for="point_types_id">Tipo de Cadastro</label>
                    <select required name="point_types_id" id="point_types_id" class="form-select">
                        <!-- percorre e printa $pointTypes -->
                        @foreach ($pointTypes as $types)
                            <option value="{{$types->id}}">{{$types->name}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="wrap">
                    <label for="animal_types_id">Animal</label>
                    <select required name="animal_types_id" id="animal_types_id" class="form-select">
                        <!-- percorre e printa $animalTypes -->
                        @foreach ($animalTypes as $types)
                            <option value="{{$types->id}}">{{$types->name}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="wrap" style="justify-items: center;">
                    <button id="btnEnviar" class="btn btn-primary">Salvar</button>
                </div>

            </form>
        </div>
    </div>
</div>

<!-- Modal Info -->
<div class="modal" id="info" aria-hidden="true">
    <div class="modal-cadastro">
        <div class="wrap-modal">
            <button id="btnCloseInfo" class="close-info">
                <img width="15" height="15" src="{{ asset('../assets/img/close.png') }}" alt="Close">
            </button>
            <div>
                <h2>Importante:</h2>
                <p>Para cadastrar um animal no mapa, clique duas vezes rapidamente no local escolhido!</p>
            </div>
        </div>
    </div>
</div>

<!-- Modal Aviso -->
<div class="modal" id="aviso" aria-hidden="true">
    <div class="modal-cadastro">
        <div class="wrap-modal">
            <button id="btnCloseAviso" class="close-aviso">
                <img width="15" height="15" src="{{ asset('../assets/img/close.png') }}" alt="Close">
            </button>
            <div>
                <h2>Importante:</h2>
                <p>Para interagir com o cadastro de animais no mapa, precisa estar logado!</p>
            </div>
        </div>
    </div>
</div>

@endsection
