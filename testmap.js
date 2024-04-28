'use strict';

console.log('Loaded map.js');

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2ZkdW5jYW4iLCJhIjoiY2x2Z3QybHh2MHlwcTJpczJyejAyYWVpNyJ9.DLToR14vGnafkx-pCGj6KA';

// Initialize the map
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sfduncan/clvgsemvr05kv01nuggof5gin',
    center: [38.744575, 9.004118],
    zoom: 12.89,
    bearing: -29.60,
    pitch: 65.00
});

// Add navigation control (without compass)
let navigation = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(navigation, 'top-left');

// Add scale control
let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
});
map.addControl(scale, 'bottom-right');

// Include PapaParse to parse CSV
const csvUrl = 'https://raw.githubusercontent.com/yourusername/yourrepository/main/LandmarksAtsede.csv';

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
    data.forEach(item => {
        var content = '';
        // Construct the content with bold headers and normal data, each on a new line
        for (const [key, value] of Object.entries(item)) {
            content += `<strong>${key}:</strong> ${value}<br>`;
        }

        var el = document.createElement('div');
        el.innerHTML = '<svg height="30" width="30"><circle cx="15" cy="15" r="10" fill="#ffcc00" fill-opacity="0.75" /></svg>';

        let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(content);

        new mapboxgl.Marker(el)
            .setLngLat([item.longitude, item.latitude])
            .setPopup(popup)
            .addTo(map);
    });
}
