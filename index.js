const express = require('express');
const { json } = require('express/lib/response');
const Datastore = require('nedb');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('server up and running at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const  database = new Datastore('database.db');
database.loadDatabase();

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

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});
