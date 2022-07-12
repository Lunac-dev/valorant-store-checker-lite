const express = require("express");
const cors = require('cors');
const app = express();

const auth = require("./auth");

const whitelist = ["https://lite.valorantstore.net", "http://localhost:3000/"] //Cors whitelist
const corsOptions = {
  origin: whitelist,
  //origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET"],
}
app.set('trust proxy', 1)
app.use(cors(corsOptions))
app.use(auth)

module.exports = {
path: "/api/",
handler: app
};