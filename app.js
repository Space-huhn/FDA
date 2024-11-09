require('dotenv').config();
const PORT = process.env.PORT;
const sequelize = require('sequelize');

const db = require('./db');
const express = require('express')
const cors = require('cors')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const fs = require('fs')

const app = express();

const http = require('http');
const path = require("node:path");
const sync = require("pg/lib/connection");
const {Sequelize} = require("sequelize");
const port = PORT || '3050';
app.use(cors())
app.use(express.json())

app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const start = async () => {
  try {
    await db.authenticate();
    await db.sync();

    // await sequelize.drop();
    app.listen(port, () => {
      console.log("server work!!!")
    })
  } catch (e) {
    console.log(e)
  }
}


start().then(r => r)





