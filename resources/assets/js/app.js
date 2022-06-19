var objMapa;
var allMarkers = [];
var allPointsData = [];
var isLoggedIn = false;

var APP = {

    init: function () {
        APP.addEscutasMenu();
        APP.addEscutasFormulario();
        APP.criarMapa();
    },

    criaHtmlInfoWindow: function (ponto) {
        return '<div id="wrap-master">' +
            '<div class="row">' +
            '<div class="col-xl-5">' +
            '<img src="/storage/' + ponto.image + '">' +
            '</div>' +
            '<div class="col-xl-7">' +
            '<div id="infoWindowId" style="display:none">' + ponto.id + '</div>' +
            '<div id="wrap-text">' +
            '<h2>' + ponto.title + '</h2>' +
            '<p>' + ponto.description + '</p>' +
            '<p> Ocorrência: ' + APP.getNomeTipos(ponto.point_types_id, "point_types_id") + '</p>' +
            '<p> Tipo de animal: ' + APP.getNomeTipos(ponto.animal_types_id, "animal_types_id") + '</p>' +
            '<button id="btnEdit" class="btn btn-primary" onclick="APP.abrirFormulario()">Editar</button>' +
            '<button id="btnDelete" class="info btn btn-primary" onclick="APP.removePonto(id)">Excluir</button>' +
            '</div>' +
            '</div>' +
            "</div>" +
            "</div>";
    },

    getNomeTipos: function (id, nomeCampo) {
        var options = document.querySelectorAll("select#" + nomeCampo + " option");
        for (var option of options) {
            if (option.value == id) {
                return option.innerText;
            }
        }
        return id;
    },

    addEscutasFormulario: function () {
        // pega o btn salvar do formulario, que está escondido, adiciona o evento de salvar o ponto
        var btn = document.querySelector("div#cadastro #btnEnviar");
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                APP.cadastrarPonto();
            })
        }

        // pega o btn fechar do formulario, que está escondido, adiciona o evento de salvar o ponto
        var btn = document.querySelector("#btnClose");
        if (btn) {
            btn.addEventListener("click", function () {
                APP.fecharFormulario();
            })
        }

        var btn = document.querySelector("#btnCloseInfo");
        if (btn) {
            btn.addEventListener("click", function () {
                APP.fecharInfo();
            })
        }

        var btn = document.querySelector("#btnCloseAviso");
        if (btn) {
            btn.addEventListener("click", function () {
                APP.fecharAviso();
            })
        }

        var btn = document.querySelector("#btnDelete");
        if (btn) {
            btn.addEventListener("click", function () {
                APP.removePonto(id);
            })
        }
    },

    addEscutasMenu: function () {
        var menuDropdown = document.querySelector(".nav-item.dropdown");
        if (menuDropdown) {
            isLoggedIn = true;
            APP.abreInfo();
            menuDropdown.addEventListener("click", function (e) {
                $(".link-menu.dropdown-toggle").toggleClass("show");
                $(".dropdown-menu.dropdown-menu-right").toggleClass("show");
            })
        } else {
            APP.abreAviso();
        }
    },

    criarMapa: function () {

        // limita utilização se não está logado
        var gestureHandling = "none";
        if (isLoggedIn) {
            gestureHandling = "auto";
        }

        // cria o mapOptions
        var opcoesMapa = {
            center: new google.maps.LatLng(-27.870200, -54.479600),
            zoom: 13,
            zoomControl: isLoggedIn,
            gestureHandling: gestureHandling,
            mapTypeId: 'roadmap'
        };

        // cria o mapa em si: new google.maps.Map
        var elementoMapa = document.getElementById("googleMap");
        objMapa = new google.maps.Map(elementoMapa, opcoesMapa);
        console.log("Mapa foi criado!");

        // faz a request: read
        var csrf_token = document.querySelector('[name=_token]').value;
        var formdata = new FormData();
        formdata.append("_token", csrf_token);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        fetch("/points/read", requestOptions)
            .then(response => {
                codigoHttp = response.status;
                return response.json();
            })
            .then(pontos => {
                for (var ponto of pontos) {
                    APP.desenharPonto(ponto);
                }
            });
        console.log("Pontos foram desenhados!");

        // detectar clique no mapa para adicionar novo ponto
        // vamos pegar duplo clique ao invés de clique
        // pq? pq senão dá conflito com outras ações, como clique e arrasta, ou clique único para editar um ponto q já está no mapa
        if (isLoggedIn) {
            objMapa.addListener('dblclick', function (e) {

                var latitude = e.latLng.lat();
                var longitude = e.latLng.lng();

                // add em campos ocultos do form
                document.querySelector('#latitude').value = latitude;
                document.querySelector('#longitude').value = longitude;

                // abre o formulário para cadastro
                APP.abrirFormulario();
            });
        }
    },

    desenharPonto: function (ponto) {

        var locationInfowindow = null;
        if (isLoggedIn) {
            zoom = true;
            var locationInfowindow = new google.maps.InfoWindow({
                content: APP.criaHtmlInfoWindow(ponto),
            });
        }

        var marker = new google.maps.Marker({
            position: {
                lat: parseFloat(ponto.latitude),
                lng: parseFloat(ponto.longitude)
            },
            map: objMapa,
            title: ponto.title,
            icon: 'assets/img/icon-pata.svg',
            animation: google.maps.Animation.DROP,
            draggable: false,
            infowindow: locationInfowindow
        });

        allMarkers.push(marker);
        allPointsData.push(ponto);

        if (isLoggedIn) {
            marker.addListener('click', function () {
                hideAllInfoWindows(objMapa);
                this.infowindow.open(objMapa, this);
            });
        }

        function hideAllInfoWindows(map) {
            for (var marker of allMarkers) {
                marker.infowindow.close(map, marker);
            }
        }
    },

    abrirFormulario: function () {
        // div do form tá escondida
        // mostra ela
        document.querySelector("div#cadastro").style.display = "block";
        // para edição: pega id do registro atual
        var idAtual = document.querySelector("div#wrap-master #infoWindowId");
        if (idAtual) {
            document.querySelector("div#cadastro #id").value = idAtual.innerText;

            for (data of allPointsData) {
                if (data.id == idAtual.innerText) {
                    document.querySelector("div#cadastro #title").value = data.title;
                    document.querySelector("div#cadastro #description").value = data.description;
                    document.querySelector("div#cadastro #point_types_id").value = data.point_types_id;
                    document.querySelector("div#cadastro #animal_types_id").value = data.animal_types_id;
                }
            }
        }
        console.log("Formulário foi mostrado!");
    },

    fecharFormulario: function () {
        // div do form tá sendo mostrada
        // esconda ela
        document.querySelector("div#cadastro").style.display = "none";
    },

    cadastrarPonto: function () {
        // cria form data
        var form = document.querySelector("#form");
        if (form.reportValidity()) {
            debugger;
            var csrf_token = document.querySelector('[name=_token]').value;
            var title = document.querySelector("#title").value;
            var description = document.querySelector("#description").value;
            var image = document.querySelector("#image").files[0];
            var latitude = document.querySelector("#latitude").value;
            var longitude = document.querySelector("#longitude").value;
            var point_types_id = document.querySelector("#point_types_id").value;
            var animal_types_id = document.querySelector("#animal_types_id").value;
            var id = document.querySelector("#id").value;

            var formdata = new FormData();
            formdata.append("_token", csrf_token);
            formdata.append("id", id);
            formdata.append("title", title);
            formdata.append("description", description);
            formdata.append("latitude", latitude);
            formdata.append("longitude", longitude);
            formdata.append("image", image);
            formdata.append("user_id", 4);
            formdata.append("point_types_id", point_types_id);
            formdata.append("animal_types_id", animal_types_id);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            var codigoHttp = null;
            var operacao = "insert";
            var rota = "/points/create";

            if (id && id > 0) {
                operacao = "update";
                rota = "/points/update";
            }

            fetch(rota, requestOptions)
                .then(response => {
                    codigoHttp = response.status;
                    return response.text()
                })
                .then(message => {

                    if (codigoHttp == 200) {

                        if (operacao == "insert") {
                            alert("Ponto foi cadastrada com o código " + message);
                            window.location.reload();
                        } else {
                            alert("Dados do ponto foi atualizado");
                        }

                    } else if (codigoHttp == 422) {
                        alert("Dados inválidos! Verifique se os campos estão preenchidos corretamente e tente novamente.");
                    } else if (codigoHttp == 500) {
                        alert("Erro: " + message);
                    } else {
                        alert("Erro " + message);
                    }
                }
                );
        }
        console.log("Ponto foi salvo!");
    },

    // Remover ponto pelo ID
    removePonto: function (id) {

        var csrf_token = document.querySelector('[name=_token]').value;
        var id = document.querySelector("div#wrap-master #infoWindowId").innerText;

        var codigoHttp = null;
        var formdata = new FormData();
        formdata.append("_token", csrf_token);
        formdata.append("id", id);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("/points/delete", requestOptions)
            .then(response => {
                codigoHttp = response.status;
                return response.text();
            })
            .then(message => {
                if (codigoHttp == 200) {
                    window.location.reload();
                } else {
                    alert("Erro " + message);
                }
            }).catch(message => {
                alert("Erro " + message);
            });
    },

    fecharInfo: function () {
        // div da info tá sendo mostrada
        // esconda ela
        document.querySelector("div#info").style.display = "none";
    },

    abreInfo: function () {

        setTimeout(function(){
            document.querySelector("div#info").style.display = "block";
         }, 2000);

    },

    fecharAviso: function () {
        // div da Aviso tá sendo mostrada
        // esconda ela
        document.querySelector("div#aviso").style.display = "none";
    },

    abreAviso: function () {

        setTimeout(function(){
            document.querySelector("div#aviso").style.display = "block";
         }, 2000);

    }
}

APP.init();


