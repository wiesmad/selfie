// Geo locate
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
        let lat, lon, weatherData, airData;
        try {
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            document.getElementById('lat').textContent = lat.toFixed(2);
            document.getElementById('lon').textContent = lon.toFixed(2);
            
            const api_url = `weather/${lat},${lon}`; 
            const resp = await fetch(api_url);
            const json = await resp.json();

            weatherData = json.weather;
            airData = json.air_quality;
            
            const { weather, visibility, wind, main, clouds, name, dt } = weatherData;
            const { temp, pressure, humidity} = main;
            const id = weather[0].id; // weather ID
            const icon = weather[0].icon; // weather icon
            imgIcon = document.createElement('img');
            imgIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            dateTime = new Date(dt * 1000).toLocaleString().split(',');
            date = dateTime[0]; // date
            time = dateTime[1]; // time
            visibility; // visibility m
            temp; // temperature °C
            pressure; // pressure mmHg
            humidity; // humidity %
            name; // city

            const { list } = airData;
            const air_q =  list[0].main.aqi;
            let aiq = '';

        switch(air_q) {
            case 1:
                aiq = 'Good';
                break;
            case 2:
                aiq = 'Fair';
                break;
            case 3:
                aiq = 'Moderate';
                break;
            case 4:
                aiq = 'Poor';
                break;
            case 5:
                aiq = 'Very Poor';
                break;
        }

        let show = document.querySelectorAll('td');
        show[0].textContent = name;
        show[1].append(imgIcon);
        show[2].textContent = `${temp} °C`;
        show[3].textContent = `${pressure} mmHg`;
        show[4].textContent = `${humidity} %`;
        show[5].textContent = date;
        show[6].textContent = time;
        show[7].textContent = aiq;

    } catch(error) {
        console.log('Something went wrong');
        console.error(error);
        show[7].textContent = 'NO DATA';
    }
        const data = { lat, lon, weatherData, airData };
        const options =  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();

        console.log(db_json); // testing var
    });
} else {
    console.log('geolocation not supported');
}
 