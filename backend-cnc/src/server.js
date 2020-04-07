import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import SerialPort from 'serialport';
import Delimiter from '@serialport/parser-delimiter';
import ByteLength from '@serialport/parser-byte-length';
import findSerial from './comunications/serial';
import queueSerial from './Queue/queueSerial';
import queueComand from './Queue/queueComand';
import queueResponse from './Queue/queueResponse';

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.json({status: 'Server is running!'});
});

app.listen(process.env.PORT, () => console.log(`Listening on PORT ${process.env.PORT}`));


/* Serial */
const Serial = async () => {

  var Myport = await findSerial();

  /* Criação da comunicaçãos serial */
  const port = new SerialPort(Myport, function (err) {
    if (err) {
      return console.log('Error-Serial: ', err.message);
    }
  });

  const parser = port.pipe(new ByteLength({length: 6}));
  //const parser = port.pipe(new Delimiter({ delimiter: [0x3E] }), new ByteLength({length: 6}))

  port.on("open", () => {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }

    console.log('serial port open');
    // let cs = [(0x00 -(0x3E + 0xA1 + 0x0A))&0xFF];
    // port.write([0x3E]);
    // port.write([0xA1])
    // port.write([0x0A]);
    // port.write([0x00]);
    // port.write([0x00]);
    // port.write(cs);

  });

  /* Evento de leitura de serial */
  parser.on('data', data => {
    console.log(data);
    queueResponse.enqueue(data);
  });

  port.on("close", () => {
    console.log('serial port close');
    setTimeout(  () =>{
      port.open();
    }, 5000);
  });

  setInterval(() => {
    //console.log(queueSerial.isEmpty());
    if (!queueSerial.isEmpty()) {
      console.log(queueSerial.peek());
      //interpreter
      queueSerial.dequeue();
    }
    // port.write(0xff);
    //console.log('.');
  },100);

  setInterval(() => {
    console.log('Run:');
    let cs = [(0x00 -(0x3E + 0xA7 + 0x0A))&0xFF];
    port.write([0x3E]);
    port.write([0xA7])
    port.write([0x0A]);
    port.write([0x00]);
    port.write([0x00]);
    port.write(cs);
  },10000);

}

Serial();


setInterval(() => {
  if(!queueComand.isEmpty()) {
    console.log(queueComand.peek());
  }
},100);



