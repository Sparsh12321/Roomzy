 const coordinates=require("../../controllers/listingcontroller");
 console.log(coordinates);
 var map = L.map('map');
    map.setView([coordinates[0], coordinates[1]], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
  