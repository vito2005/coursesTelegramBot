const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const port = 3000;
const options = {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem')
};

const Server = ()=>{
    app.post('/receive',(req, res)=>{
        console.log('you have got some incoming payment');
    res.status(200).send();
    });

    app.get('/',(req, res)=>{
        console.log('get request');
    res.status(200).send();
    });

    https.createServer(options, app)
        .listen(port, function () {
            console.log('Example app listening on port 3000!')
        });
}

    module.exports = Server;

