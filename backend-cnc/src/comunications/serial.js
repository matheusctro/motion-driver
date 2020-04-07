import SerialPort from 'serialport'
import Delimiter from '@serialport/parser-delimiter'

export default async function findSerial() {
  let p = null;
  var ports = await SerialPort.list().then(ports => {
    if (ports.length == 0) {
      console.log('Nenhuma serial encontrada!!!');
    }
    ports.map(name => {
      console.log('Serial: ' + name.path.toString() + ',' + name.manufacturer.toString());
    });

    for (var i = 0; i < ports.length; i++) {
      if (ports[i].manufacturer.toString() == 'STMicroelectronics') {
        p = ports[i].path.toString();
      }
    }
  });

  if (p == null) {
    console.log('Serial correta não encontrada!!!');
    return;
  }
  return p;
}
