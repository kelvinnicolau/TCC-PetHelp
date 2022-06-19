const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.sass('resources/assets/sass/main.scss', 'public/assets/css')
    .sass('resources/assets/sass/style.scss' , 'public/assets/css')
    .sass('resources/assets/sass/pages/home.scss', 'public/assets/css/pages')
    .sass('resources/assets/sass/pages/mapa.scss', 'public/assets/css/pages')
    .scripts('node_modules/jquery/dist/jquery.js', 'public/assets/vendor/jquery.js')
    .scripts('node_modules/bootstrap/dist/js/bootstrap.bundle.js', 'public/assets/vendor/bootstrap.js')
    .copyDirectory('resources/assets/js', 'public/assets/js')
    .copyDirectory('resources/assets/js/sw.js', 'public')
    .copyDirectory('resources/assets/img', 'public/assets/img')
    .copyDirectory('resources/assets/vendor', 'public/assets/vendor');
