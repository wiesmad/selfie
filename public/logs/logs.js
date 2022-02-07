const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution = 
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    
    data.map(item => {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        const tmp = item.weatherData.main.temp;
        const txt = `The temparature is ${tmp}°C`;

        marker.bindPopup(txt);
    })
   
    console.log(data);
}