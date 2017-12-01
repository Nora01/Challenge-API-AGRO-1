$(document).ready(function() {
    //cache des données des stations
    var listeStations = [];

    //cache des relevés de températures des stations
    var listeTemperatures = [];

    //cache des relevés des prévisions
    var listePrevisions = [];

    //Paramétrage
    var param = {
        "dropdownMaxResults": 100,
        "meteoMaxResults": 10000,
        "meteoAnnee": 2017,
        "apiKey": ""
    }

    //Mise à jours des Widgets
    var updateWidgets = function(stationId) {
        updateTable(listeTemperatures[stationId], listePrevisions[stationId]);
        updateTemperatures(listeTemperatures[stationId], listePrevisions[stationId]);
        updateMap(listeStations[stationId].fields.latitude, listeStations[stationId].fields.longitude);
        $(".spinner").hide();
    }

    /**
     * Récupération des données ARPEGE de la station
     * @param int stationId Id de la station
     * @return jqXHR | boolean
     */
    var updateData = function(stationId) {
        $(".spinner").show();
        if (stationId === undefined) {
            return false;
        }

        if (listeTemperatures[stationId] !== undefined && listePrevisions[stationId] !== undefined) {
            updateWidgets(stationId);
            return true;
        }

        var urlJSON = "https://plateforme.api-agro.fr/service/sorties-de-modeles-meteofrance/arpege?lat=" + listeStations[stationId].fields.latitude + "&long=" + listeStations[stationId].fields.longitude + "&apikey=" + param.apiKey;

        return $.getJSON(urlJSON, function(data) {
            listePrevisions[stationId] = JSON.parse(JSON.stringify(data));
        }).then(
            function() {
                var urlJSON = "https://plateforme.api-agro.fr/api/records/1.0/search/?dataset=donnees-synop-agregees-journalier&facet=numer_station&facet=annee&q=numer_station:" + stationId + "&q=annee:" + param.meteoAnnee + "&rows=" + param.meteoMaxResults + "&apikey=" + param.apiKey;
                return $.getJSON(urlJSON, function(data) {
                    listeTemperatures[stationId] = JSON.parse(JSON.stringify(data));
                });
            }
        ).then(function() {
            updateWidgets(stationId);
        });
    }


    /**
     * Mise à jour de la liste déroulante depuis la liste des stations SYNOP
     */
    var processDropdown = function() {
        var stations = {};
        var urlJSON = "https://plateforme.api-agro.fr/api/records/1.0/search/?dataset=stations-synop&rows=" + param.dropdownMaxResults + "&apikey=" + param.apiKey;

        $.getJSON(urlJSON, function(data) {
            stations = JSON.parse(JSON.stringify(data));

            data.records.forEach(function(e) {
                $(".combobox").append("<option value= '" + e.fields.nom + "' data-lat='" + e.fields.latitude + "' data-long='" + e.fields.longitude + "' data-stationid='" + e.fields.id + "'>" + e.fields.nom.replace(/\'/g, " ") + "</option>");
                listeStations[e.fields.id] = e;
            });

            $('.combobox').combobox();

            $(".combobox").on("change", function() {
                if ($('.combobox-container input').val() !== "") {
                    $('#container-temperatures').removeClass('animated flipInX');
                    $('#container-map').removeClass('animated flipInX');
                    $('#container-data').removeClass('animated flipInX');
                    $(".dropdown button").text($(this).text() + " ");
                    $(".dropdown button").append("<span class='caret'></span>");
                    $(".footer").css("position", "relative");
                    $(".footer").css("bottom", "0px");

                    var stationId = $(".combobox :contains('" + $(".combobox-container .active").data("value") + "')").data("stationid");

                    if (stationId !== undefined) {
                        updateData(stationId);
                    }
                }

            });
            $(".combobox-container input").attr("placeholder", "Sélectionner une station...");
        });
    }

    processDropdown();
});