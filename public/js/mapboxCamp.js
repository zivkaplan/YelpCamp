mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({
    offset: 35,
})
    .setLngLat(campground.geometry.coordinates)
    .setMaxWidth('150px')
    .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
    .addTo(map);

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
