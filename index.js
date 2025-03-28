const express = require("express");
const db = require('./db');
const { log } = require("console");

const app = express();
const port = 3004;

app.use(express.json())

app.get("/listSchools", (request , response) => {
    const { latitude, longitude } = request.query;

    if (!latitude || !longitude) {
        return response.status(400).json({ error: 'Latitude and longitude are required' });
    }

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    const query = 'SELECT *, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance FROM schools ORDER BY distance ASC';
    
    db.query(query, [latitude, longitude, latitude], (err, results) => {
        if (err) {
            return response.status(500).json({ error: 'Database error', details: err });
        }
        response.status(200).json(results);
    });
})

app.post("/addSchool", (request, response) => {
    const {name, address,latitude,longitude} = request.body;
    if(!name || !address || !latitude || !longitude){
        return response.status(400).json("please give correct into");
    }

    db.query('insert into schools (name,address, latitude,longitude) values(?,?,?,?)',[name,address,latitude,longitude],(err, result) => {
        if(err){
            console.log(`error ${err}`)
            return response.status(500).json({error:"Failed to add the school"})
        }

        response.json({ message: 'school inserted successfully' })
    })

})

app.listen(port , () => {
    console.log(`successfully running in the port ${port}`)
})