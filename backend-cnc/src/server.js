import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import morgan from 'morgan';
import cors from 'cors';

const server = require('http').Server(app);
global.io = require('socket.io')(server);
// const io = require('./socket.io').init(server);

app.use(morgan('dev'));
app.use(cors());

import routes from './routes';
import serial from './comunications/serial/serial';
import {readPosition, ack} from './cnc/driver';
//import {readPosition} from './cnc/driver';
import {setAllow, readAllow, readAllowAck} from './comunications/serial/allow';

// Mongo DB
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // We are connected!
});

app.use(express.json());
app.use(routes);

server.listen(process.env.PORT, () => console.log(`Listening on PORT ${process.env.PORT}`));

serial();

setInterval(async () => {
  let encoder;
  if(readAllow()){
    setAllow(false);
    encoder = await readPosition();
    setAllow(true);
    io.emit('/encoder', encoder);
  }
},300);

setInterval(async () => {
  let ackResponse;
  if (readAllow()) {
    setAllow(false);
    ackResponse = await ack();
    setAllow(true);
    io.emit('/ack', ackResponse);
  }
}, 1000);

// taskkill /f /im node.exe
