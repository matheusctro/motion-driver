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

  const parser = port.pipe(new ByteLength({length: 4}));

  port.on("open", () => {
    console.log('serial port open');
  });

  /* Evento de leitura de serial */
  parser.on('data', data => {
    console.log(data);
    queueSerial.enqueue(data);
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
}

Serial();
