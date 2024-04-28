'use strict';

console.log('Loaded testmap.js');

// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2ZkdW5jYW4iLCJhIjoiY2x2Z3QybHh2MHlwcTJpczJyejAyYWVpNyJ9.DLToR14vGnafkx-pCGj6KA';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sfduncan/clvgsemvr05kv01nuggof5gin',
    center: [38.744575, 9.004118],
    zoom: 12.89,
    bearing: -29.60,
    pitch: 65.00
});

// Create an instance of NavigationControl
let navigation = new mapboxgl.NavigationControl({ showCompass: true });
map.addControl(navigation, 'top-left');

// Create an instance of ScaleControl
let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
});
map.addControl(scale, 'bottom-right');

// Include PapaParse to parse CSV
const csvUrl = 'https://raw.githubusercontent.com/sfdduncan/TestMaps/main/LandmarksAtsede.csv';

fetch(csvUrl)
.then(response => response.text())
.then(csvString => {
    const data = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    }).data;

    addMarkers(data);
})
.catch(error => console.error('Error fetching or parsing data: ', error));

function addMarkers(data) {
    // Clear existing markers
    if (window.markers) {
        window.markers.forEach(marker => marker.remove());
    }
    window.markers = [];

    data.forEach(item => {
        var content = `<b>Landmark:</b> ${item.LandmarkName}<br>
<b>Purpose:</b> ${item.Purpose}<br>
<b>Location:</b> ${item.Location}<br>
<b>Architect:</b> ${item.Architect}<br>
<b>Nationality:</b> ${item.Nationality}<br>
<b>Year Built:</b> ${item.YearBuilt}<br>;

        var el = document.createElement('div');
        el.innerHTML = '<svg height="30" width="30"><circle cx="15" cy="15" r="14" fill="#ffcc00" fill-opacity="0.75" /></svg>';

        let marker = new mapboxgl.Marker(el)
            .setLngLat([parseFloat(item.lon), parseFloat(item.lat)])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
            .addTo(map);

        window.markers.push(marker);
    });
}

// Event listener for the architect nationality filter
document.getElementById('architectFilter').addEventListener('change', function(e) {
    addMarkers(data.filter(d => d.Nationality === e.target.value || e.target.value === ''));
});
