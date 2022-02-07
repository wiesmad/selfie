const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch'); // node-fetch@2
require('dotenv').config();

// set up server
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public')); // serving 'public/index.html'
app.use(express.json({ limit: '1mb' }));

// create database NeDB
const  database = new Datastore('database.db');
database.loadDatabase();

// response to 'logs/index.js'
app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            console.log(err);
            return;
        }
        response.json(data);
    })
})

// 
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`; 
    const weather_resp = await fetch(weather_url);
    const weather_data = await weather_resp.json();

    const aq_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`; 
    const aq_resp = await fetch(aq_url);
    const aq_data = await aq_resp.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    }
    response.json(data);
});


