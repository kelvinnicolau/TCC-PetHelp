<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <title>Pet Help - @yield('titulo')</title>
        <meta charset="utf-8">

        <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/main.css') }}">

        <!-- Scripts -->
        <script src="{{ asset('assets/vendor/jquery.js') }}"></script>
        <script src="{{ asset('assets/vendor/bootstrap.js') }}"></script>

        <!-- Swiper JS - JS do Carrossel-->
        <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

        <!-- Link Swiper's CSS -->
        <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css"/>

        <link rel="manifest" href="{{ URL::to('/manifest.webmanifest') }}">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @stack('stack-head-end')
    </head>

    <body>
        {{-- Header do Site --}}
        @include('layouts.app')

        {{-- Conteúdo do Site --}}
        @yield('content')

        {{-- Rodapé do site --}}
        @include('includes.footer')
    </body>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDT_U6ImQ6emt37NGRR8MJohx3p-1ijCdM"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>
    <script>
        if('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('{{ URL::to("sw.js") }}').then(function(registration) {
                    console.log('Service Worker 	Registered', registration);
                }).catch(function(error) {
                    console.log('Service worker registration failed:', error);
                });
            });
        }
    </script>
</html>
