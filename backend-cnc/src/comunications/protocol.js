const LOADcmd = 0xA1;
const EXECUTEcmd = 0xA2;
const SET_PARAMcmd = 0xA3;
const WRITEcmd = 0xA4;
const UPDATEcmd = 0xA5;
const READcmd = 0xA6;
const RUNcmd = 0xA7;
const STOPcmd = 0xA8;
const ACKcmd = 0xA9;
const READ_POScmd = 0xAA;

function checkData(CMD){

}

function interpreter(CMD) {
  switch (CMD[0]) {
    case LOADcmd:
      break;

    case EXECUTEcmd:
      break;

    case SET_PARAMcmd:
      break;
  }

}

module.exports = {
  checkData,
  interpreter
}
