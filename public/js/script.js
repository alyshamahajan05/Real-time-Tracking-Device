document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Emit location data to the server
                socket.emit('send-location', { latitude, longitude });

                // Update map view with current location
                map.setView([latitude, longitude], 15);
            },
            (error) => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    // Ensure the map is fully loaded and defined
    var map = L.map('map').setView([0, 0],16);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markers = {};

    socket.on('receive-location', (coords) => {
        const { id, latitude, longitude } = coords;
        map.setView([latitude, longitude]);

        if(markers[id]) {
            markers[id].setLatLng([latitude, longitude]);
        }
        else{
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }
    });

    socket.on('user-disconnected', (id) => {
        if(!markers[id]) return;
        map.removeLayer(markers[id]);
        delete markers[id];
    });
});
