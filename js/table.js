$(document).ready(function() {
    var DataTable;

    $("#export-button").click(function() {
        $("#table").tableToCSV();
    });
    /**
     * Création et paramétrage de datatable
     */
    initTable = function() {
        DataTable = $('#table').DataTable({
            "scrollY": "300px",
            "scrollCollapse": true,
            "paging": false,
            "searching": false,
            language: {
                processing: "Traitement en cours...",
                search: "Rechercher&nbsp;:",
                lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
                info: "_END_ &eacute;l&eacute;ments affichés.",
                infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                infoPostFix: "",
                loadingRecords: "Chargement en cours...",
                zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
                emptyTable: "Aucune donnée disponible dans le tableau",
                paginate: {
                    first: "Premier",
                    previous: "Pr&eacute;c&eacute;dent",
                    next: "Suivant",
                    last: "Dernier"
                },
                aria: {
                    sortAscending: ": activer pour trier la colonne par ordre croissant",
                    sortDescending: ": activer pour trier la colonne par ordre décroissant"
                },
            }
        });

    }

    /**
     * Mise à jour du tableau des températures depuis les résultats des API Synop et Arpege
     * @param object dataSynop Données Synop brute stringifiées de la station
     * @param object dataArpege Données Arpege brute stringifiées de la station
     */
    updateTable = function(dataSynop, dataArpege) {
        if (dataSynop === undefined) {
            return false;
        }

        $(".chart-stage-table table").html("");
        html = "<thead><tr><th>Date</th><th>Temp. moyenne</th><th>Temp. min</th><th>Temp. max</th></tr></thead>";
        html += "<tbody>";

        dataSynop.records.forEach(function(e) {
            html += "<tr>";
            html += "<td>" + e.fields.date.slice(0, 10) + "</td>";
            html += "<td>" + e.fields.tmoy + "</td>";
            html += "<td>" + e.fields.tmin + "</td>";
            html += "<td>" + e.fields.tmax + "</td>";
            html += "</tr>";
        });

        if (dataArpege !== undefined) {
            dataArpege.records.forEach(function(e) {
                html += "<tr>";
                html += "<td>" + e.fields.forecast.slice(0, 10) + "</td>";
                html += "<td>" + e.fields.temperature.toPrecision(3) + "</td>";
                html += "<td></td>";
                html += "<td></td>";
                html += "</tr>";
            });
        }

        html += "</tbody>";
        $(".chart-stage-table table").html(html);

        if (Boolean(DataTable) == false) {
            initTable();
        } else {
            DataTable.destroy();
            initTable();
        }
        $('#table').DataTable().draw();
        $('#container-data').css('visibility', 'visible').show().addClass('animated flipInX');
    }

});