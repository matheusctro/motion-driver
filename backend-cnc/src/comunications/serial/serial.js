import SerialPort from 'serialport';
import ByteLength from '@serialport/parser-byte-length';

import queueComand from '../../Queue/queueComand';
import queueResponse from '../../Queue/queueResponse';
import queueResponseEncoder from '../../Queue/queueResponseEncoder';
import findSerial from './findSerial';

async function serial() {
  var Myport = await findSerial();
  let port;
  let parser;

  if (Myport == null) {
    io.emit('/status', "CNC desconectada!");
    const interval = setInterval(async () => {
      try {
        Myport = await findSerial();
        if (Myport != null) {
          /* Criação da comunicaçãos serial */
          port = new SerialPort(Myport, function (err) {
            if (err) {
              return console.log('Error-Serial: ', err.message);
            }
          });

          parser = port.pipe(new ByteLength({ length: 6 }));
          clearInterval(interval);
        }
      }
      catch (e) {
        console.log(e);
      }
    }, 3000);

  } else {

    /* Criação da comunicaçãos serial */
    port = new SerialPort(Myport, function (err) {
      if (err) {
        return console.log('Error-Serial: ', err.message);
      }
    });

    parser = port.pipe(new ByteLength({ length: 6 }));

    port.on("open", () => {
      console.log('serial port open');
      io.emit('/CNC', "conectada");
    });

    /* Evento de leitura de serial */
    parser.on('data', data => {
      let arr = [];
      if (data.length == 6) {
        if (data[0] == 0x3E) {
          let i = 0;
          for (i; i < 6; i++) arr[i] = data[i];
          if (arr[1] == 0xAA) {
            queueResponseEncoder.enqueue(arr);
          } else {
            //console.log(`Recebido: [${arr}]`);
            queueResponse.enqueue(arr);
          }
        }
      }
    });

    port.on("close", () => {
      console.log('serial port close');
      io.emit('/CNC', "desconectada");

      const interval = setInterval(async () => {
        try {
          Myport = await findSerial();
          if (Myport != null) {
            port.open();
            clearInterval(interval);
          }
        }
        catch (e) {
          console.log(e);
        }
      }, 3000);
    });



    setInterval(() => {
      if (!queueComand.isEmpty()) {
        let sendData = queueComand.peek();
        // console.log(`Enviado: [${sendData}]`);
        port.write([sendData[0]]);
        port.write([sendData[1]]);
        port.write([sendData[2]]);
        port.write([sendData[3]]);
        port.write([sendData[4]]);
        port.write([sendData[5]]);
        queueComand.dequeue();
      }
    }, 100);
  }
}

export default serial;
