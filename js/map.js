$(document).ready(function() {

    //Création de l'objet MAP leaflet
    mymap = L.map('map');
    var marker;
    /**
     * Mise à jour de la carte avec marqueur sur latitude et longitude
     * @param float lat latitude du marqueur
     * @param float long longitude du marqueur
     */
    updateMap = function(lat, long) {

        var icon = L.icon({
            iconUrl: 'css/external/images/marker-icon.png',

            iconSize: [40, 40], // size of the icon
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        });
        mymap.setView([lat, long], 7);

        if (marker !== undefined) {
            mymap.removeLayer(marker);

        }

        var tileset = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
        var attributionText = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

        L.tileLayer(tileset, {
            attribution: attributionText,
        }).addTo(mymap);

        var marker = L.marker([lat, long], {
            icon: icon
        }).addTo(mymap);
        $('#container-map').css('visibility', 'visible').show().addClass('animated flipInX');

    }
});