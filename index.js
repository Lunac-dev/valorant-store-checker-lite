const express = require('express');
const cors = require('cors');
const app = express();

const dotenv = require('dotenv');

dotenv.config();

const port = 3100;

var whitelist = ["https://lite.valorantstore.net", "http://localhost:3000"] //Cors whitelist

app.set('trust proxy', 1)

var corsOptions = {
    origin: whitelist,
    //origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET"],
}

app.use(cors(corsOptions)) //Cors

const api = require("./auth");
app.use(api);

//404
app.use((_req, res, _next)=>{ res.status(404).send('Content Not Found'); });

var server = app.listen(port, function(){
    console.log("Node.js is listening to port:" + server.address().port);
});