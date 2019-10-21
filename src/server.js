const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'db',
  port: '3306',
  user: 'user',
  password: 'password', 
  database: 'db'
});

const config = {
    name: 'sample-express-app',
    port: 3000,
    host: '0.0.0.0',
};



const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

connection.connect (function(err) {
  if (err)
    logger.error("Cannot connect to DB!");
  logger.info("Connected to the DB!");
});

app.get('/', (req, res) => {
  // connection.connect (function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  // });
    connection.query('SELECT * from data', function (err, rows, fields) {
      
      if(err) {
        logger.error("Error while executing Query");
      };
      logger.info(rows.length);
      logger.info(rows[0].name + ' ' + rows[0].id);
      logger.info(fields.length);
    })
    res.status(200).send('Hellooooo, still here!?!?');
  // connection.end();
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});