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
import {readPosition} from './cnc/driver';
import {setAllow, readAllow} from './comunications/serial/allow'

import queueComand from './Queue/queueComand';
import queueResponse from './Queue/queueResponse';

// io.on('connection', (socket) => {
//   console.log('New client connected');
//   socket.on('encoder', (message) => {
//     console.log(`encoder: ${message}`);
//   });
//   socket.on('status', (message) => {
//     console.log(`status: ${message}`);
//   });
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

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
    // console.log(encoder);
  }
  // let encoder = await readPosition();
  // io.emit('/encoder', encoder);
  // console.log(encoder);
},1000);


// setInterval(async () => {
//   if(readAllow()){
//     queueComand.clear();
//     queueResponse.clear();
//   }
// }, 10000);

// // clearMotion(9);
// // console.log(read(9));
// // ack();
// // stop();
// // goHome();
// // run(10);
// // goHome();
// let programa = {
//   id: 10,
//   qtd_cmmds: 5,
//   cmmds: [ {"mover":"INICIO"},
//               {"mover":{x: 300, y: 2, z: 1}},
//               {"esperar": 200},
//               {"acionar": 2},
//               {"desacionar": 2}]
// };
// write(programa);

// read(10);
// // run(10);

// taskkill /f /im node.exe


