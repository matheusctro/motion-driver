import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import serial from './comunications/serial/serial';
import {readPosition,ack} from './cnc/driver';
import {setAllow, readAllow} from './comunications/serial/allow'
import queueComand from './Queue/queueComand';
import queueResponse from './Queue/queueResponse';

dotenv.config();

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

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.json({status: 'Server is running!'});
});

app.listen(process.env.PORT, () => console.log(`Listening on PORT ${process.env.PORT}`));

serial();

setInterval(async () => {
  let encoder;
  if(readAllow()){
    setAllow(false);
    encoder = await readPosition();
    setAllow(true);
    // encoder = await ack();
    console.log(encoder);
  }
}, 1500);

setInterval(async () => {
  if(readAllow()){
    queueComand.clear();
    queueResponse.clear();
  }
}, 10000);


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


