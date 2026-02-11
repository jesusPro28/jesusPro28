const lat = 21.148044;
const lon = -98.346157; 
const zoom = 17; 

const map = L.map('map').setView([lat, lon], zoom);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '© OpenStreetMap'
}).addTo(map);


const perimetroCasa = [
    [21.148717, -98.347350],
    [21.148396, -98.346708],
    [21.147783, -98.347136],
    [21.148187, -98.347751]
];

const homePolygon = L.polygon(perimetroCasa, {
    color: '#3a502c',      
    fillColor: '#2ec83d',  
    fillOpacity: 0.6,
    weight: 2
}).addTo(map);


homePolygon.on('click', function(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`
            <div style="text-align:center;">
                <h3> Mi Hogar</h3>
                <p>Este es el perímetro de mi territorio</p>
                <small>Lat: ${e.latlng.lat.toFixed(5)}<br>Lon: ${e.latlng.lng.toFixed(5)}</small>
            </div>
        `)
        .openOn(map);
});