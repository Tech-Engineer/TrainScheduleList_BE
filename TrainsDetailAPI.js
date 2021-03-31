const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());

const fetchStationsData = async() => {
    return await axios.get('https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
                            {headers: {'Ocp-Apim-Subscription-Key': '9501613007cd41398976a63b0a5bd925'}});    
};

const departingTrainsList = async(stationCode) => {
    return await axios.get(`https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=${stationCode}`,
                            {headers: {'Ocp-Apim-Subscription-Key': '9501613007cd41398976a63b0a5bd925'}});
};

app.get('/', async(req, res) => {
    let stationsList;   
    await fetchStationsData()
    .then(response => {
        stationsList = response.data;
        res.send({"list": stationsList});
    })
    .catch(err => {
        if(err.response) {
            res.send({
                statusCode: err.response.data.statusCode,
                errMsg: err.response.data.message
            });
        } else {
            res.send({err})
        }
    }); 
});

app.get('/departuresList', async(req, res) => {
    const stationCode = req.query.code;
    let departuringTrains;
    await departingTrainsList(stationCode)
    .then(response => {
        departuringTrains = response.data;
        res.send({"departList": departuringTrains});
    })
    .catch(err => {
        if(err.response) {
            res.send({
                statusCode: err.response.data.statusCode,
                errMsg: err.response.data.message
            });
        } else {
            res.send({err})
        }
    });    
});

app.listen(8080, () => {
    console.log("Server started successfully");
})