$(document).ready(function() {

    /**
     * Création du widget et affichage des températures
     * @param array trange Tableau des valeurs moyennes relevées au format [date au format UTC, température]
     * @param array taverages Tableau des valeurs moyennes relevées au format [date au format UTC, température mininale relevée, température maximale relevée]
     * @param array tprev Tableau des prévisions de températures au format [date au format UTC, température prévisionnelle]
     */
    drawTemperatures = function(trange, taverages, tprev) {
        trange = trange.sort((a, b) => a[0] - b[0]);
        taverages = taverages.sort((a, b) => a[0] - b[0]);
        tprev = tprev.sort((a, b) => a[0] - b[0]);

        Highcharts.setOptions({
            lang: {
                months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
                weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                shortMonths: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Déc'],
                decimalPoint: ',',
                downloadPNG: 'Télécharger en image PNG',
                downloadJPEG: 'Télécharger en image JPEG',
                downloadPDF: 'Télécharger en document PDF',
                downloadSVG: 'Télécharger en document Vectoriel',
                exportButtonTitle: 'Export du graphique',
                loading: 'Chargement en cours...',
                printButtonTitle: 'Imprimer le graphique',
                resetZoom: 'Réinitialiser le zoom',
                resetZoomTitle: 'Réinitialiser le zoom au niveau 1:1',
                thousandsSep: ' ',
                decimalPoint: ','
            }
        });
        Highcharts.chart('temperatures', {
            title: {
                text: ""
            },

            xAxis: {
                type: 'datetime'
            },

            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°C'
            },
            legend: {},
            series: [{
                name: 'Prévisions',
                data: tprev,
                zIndex: 1,
                color: "#F78A20",

                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: "#F78A20"
                }
            }, {
                name: 'Moyenne',
                data: taverages,
                zIndex: 1,
                color: "#4F9356",
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: "#4F9356"
                }
            }, {
                name: 'Min/Max',
                data: trange,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: "#93CD97",
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                },
            }]
        });
        $('#container-temperatures').css('visibility', 'visible').show().addClass('animated flipInX');

    }

    /**
     * Mise à jour des températures depuis les résultats des API Synop et Arpege
     * @param object dataSynop Données Synop brute stringifiées de la station
     * @param object dataArpege Données Arpege brute stringifiées de la station
     */
    updateTemperatures = function(dataSynop, dataArpege) {

        if (dataSynop === undefined) {
            return false;
        }

        var taverages = [];
        var trange = [];
        var tprev = [];

        dataSynop.records.forEach(function(e) {
            var date = new Date(Date.parse(e.fields.date));
            date = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            taverages.push([date, e.fields.tmoy]);
            trange.push([date, e.fields.tmin, e.fields.tmax]);
        });

        if (dataArpege !== undefined) {
            dataArpege.records.forEach(function(e) {
                var date = new Date(Date.parse(e.fields.forecast));
                date = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                tprev.push([date, e.fields.temperature]);
            });
        }

        drawTemperatures(trange, taverages, tprev);
    }
});