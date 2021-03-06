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
const AXES_FREEcmd = 0xAB;

/** Opcodes */
const DIRop = 0x1;
const RUNop = 0x2;
const OUTop = 0x3;
const GOTOop = 0x4;
const GOHOMEop = 0x5;
const WAITFORop = 0x7;
const STEPop = 0x8;
const GOMMop = 0x9;
const GOSTEPop = 0xA;
const SETop = 0xB;
const DELAYop = 0xC;
const MMop = 0xD;
const MM_ABSop = 0xE;

/** Endereço de mémoria da eeprom do microcontrolador */
const PARAM_X = 36;
const PARAM_Y = 37;
const PARAM_Z = 38;
const PARAM_kp_x = 39;
const PARAM_kd_x = 40;
const PARAM_ki_x = 41;
const PARAM_kp_y = 42;
const PARAM_kd_y = 43;
const PARAM_ki_y = 44;
const PARAM_kp_z = 45;
const PARAM_kd_z = 46;
const PARAM_ki_z = 47;

import queueComand from '../../src/Queue/queueComand';
import queueResponse from '../../src/Queue/queueResponse';
import queueResponseEncoderX from '../Queue/queueResponseEncoderX';
import queueResponseEncoderY from '../Queue/queueResponseEncoderY';
import queueResponseEncoderZ from '../Queue/queueResponseEncoderZ';
import queueResponseAck from '../../src/Queue/queueResponseAck';
import { listen } from 'socket.io';

async function calibration() {
  return await execute_cmd(0x6C, 0x00);
}

async function goHome() {
  return await execute_cmd(0x50, 0x00);
}

async function step(motor, step, mode) {
  let opcode1 = 0x00;
  let opcode0 = 0x00;
  let motor_ = 0;

  if (motor == 'x') motor_ = 0;

  if (motor == 'y') motor_ = 1;

  if (motor == 'z') motor_ = 2;

  if (mode) {  // cm
    opcode1 = Number((GOMMop << 4) & 0xF0 | (motor_ << 2) & 0x0C | step & 0x0300);
    opcode0 = Number(step & 0xFF);
  } else {    // step
    opcode1 = Number((GOSTEPop << 4) & 0xF0 | (motor_ << 2) & 0x0C | step & 0x0300);
    opcode0 = Number(step & 0xFF);
  }
  return await execute_cmd(opcode1, opcode0);
}

async function stop() {
  return await stop_cmd();
}

async function run(MOTION) {
  let res;

  res = await run_cmd(MOTION);
  if (!res) return false;

  return await waitfinish();
}

async function setSize(sizeX, sizeY, sizeZ) {
  let VALUE1 = 0x00;
  let VALUE0 = 0x00;

  VALUE0 = sizeX & 0x00FF;
  VALUE1 = sizeX & 0xFF00;

  let res = await set_param_cmd(PARAM_X, VALUE1, VALUE0);
  if (!res) return false;

  VALUE0 = sizeY & 0x00FF;
  VALUE1 = sizeY & 0xFF00;

  res = await set_param_cmd(PARAM_Y, VALUE1, VALUE0);
  if (!res) return false;

  VALUE0 = sizeZ & 0x00FF;
  VALUE1 = sizeZ & 0xFF00;

  res = await set_param_cmd(PARAM_Z, VALUE1, VALUE0);
  if (!res) return false;

  return true;
}

async function write(programa) {
  let MOTION = programa.id;
  let CMDS = programa.cmmds;
  let OPCODE = [];
  OPCODE = decode(CMDS);

  let res = await execute_cmd(0x50, 0x00);
  if (!res) return false;
  

  res = await waitfinish();
  if (!res) return false;

  res = await load_cmd(MOTION);
  if (!res) return false;

  var j = 0;
  for (j = 0; j < OPCODE[1].length; j++) {
    res = await write_cmd(j, OPCODE[0][j], OPCODE[1][j]);
    if (!res) return false;
  }

  res = await update_cmd();
  if (!res) return false;

  return true;
}

async function read(MOTION) {
  let opcode = [];
  let CMD;
  let i = 0;

  let res = await load_cmd(MOTION);
  if (!res) return false;

  for (i = 0; i < 64; i++) {
    CMD = await read_cmd(i);
    opcode.push(CMD);
    if (CMD[0] == 0 && CMD[1] == 0) break;
  }

  return uncode(opcode, MOTION);
}

async function clearMotion(MOTION) {

  let res = await load_cmd(MOTION);
  if (!res) return false;

  var j = 0;
  for (j = 0; j < 64; j++) {
    res = await write_cmd(j, 0x00, 0x00);
    if (!res) return false;
  }

  res = await update_cmd();
  if (!res) return false;

  return true;
}

async function  readPosition(){
  let pos = [];

  pos[0] = await read_pos_x_cmd();
  pos[1] = await read_pos_y_cmd();
  pos[2] = await read_pos_z_cmd();

  return pos;
}

async function axesFree(mode) {
  let mode_;

  if (mode == "true") {
    mode_ = 0x01;
  } else {
    mode_ = 0x00;
  }

  return await axesFree_cmd(mode_);
}

async function ack() {
  return await ack_cmd();
}

async function execute(comand) {
  let OPCODE = [];
  let res;

  OPCODE = decode([comand]);

  var j = 0;
  for (j = 0; j < OPCODE[1].length; j++) {
    if(OPCODE[0][j] == 0x00) break;

    res = await execute_cmd(OPCODE[0][j], OPCODE[1][j]);
    if (!res) return false;
  }
  return true;
}

async function updateGains(gains) {

  let VALUE1 = [0x00, 0x00, 0x00];
  let VALUE0 = [0x00, 0x00, 0x00];

  VALUE0[0] = gains.kp & 0x00FF;
  VALUE1[0] = gains.kp & 0xFF00;

  VALUE0[1] = gains.kd & 0x00FF;
  VALUE1[1] = gains.kd & 0xFF00;

  VALUE0[2] = gains.ki & 0x00FF;
  VALUE1[2] = gains.ki & 0xFF00;

  let res;

  switch(gains.motor){
    case 'x':
      res = await set_param_cmd(PARAM_kp_x, VALUE1[0], VALUE0[0]);
      if (!res) return false;

      res = await set_param_cmd(PARAM_kd_x, VALUE1[1], VALUE0[1]);
      if (!res) return false;

      res = await set_param_cmd(PARAM_ki_x, VALUE1[2], VALUE0[2]);
      if (!res) return false;

      res = await update_cmd();
      if (!res) return false;

      break;
    case 'y':
      res = await set_param_cmd(PARAM_kp_y, VALUE1[0], VALUE0[0]);
      if (!res) return false;

      res = await set_param_cmd(PARAM_kd_y, VALUE1[1], VALUE0[1]);
      if (!res) return false;

      res = await set_param_cmd(PARAM_ki_y, VALUE1[2], VALUE0[2]);
      if (!res) return false;

      res = await update_cmd();
      if (!res) return false;

      break;
    case 'z':
      res = await set_param_cmd(PARAM_kp_z, VALUE1[0], VALUE0[0]);
      if (!res) return false;

      res = await set_param_cmd(PARAM_kd_z, VALUE1[1], VALUE0[1]);
      if (!res) return false;

      res = await set_param_cmd(PARAM_ki_z, VALUE1[2], VALUE0[2]);
      if (!res) return false;

      res = await update_cmd();
      if (!res) return false;

      break;
  }

  return true;
}

/**
 * Funções Auxiliares
 */
function decode(CMDS) {
  let OPCODE2 = [];
  let OPCODE1 = [];
  let opcodes = [];
  let params = [];
  var i = 0;
  var k = 0;

  for (k = 0; k < CMDS.length; k++) {
    let CMD = CMDS[k];
    for (i in CMD) {
      opcodes[k] = i;
      params[k] = CMD[i];
    }
  }

  for (k = 0; k < opcodes.length; k++) {
    switch (opcodes[k]) {
      case 'interpolar':
        if (params[k] == "INICIO") {
          OPCODE2.push(GOHOMEop << 4);
          OPCODE1.push(0x00);
        } else if (params[k] == "FIM") {
          OPCODE2.push(GOTOop << 4 | 0x0D);
          OPCODE1.push(0x00);
        } else {
          let m = 0;
          let step = [];
          let dir;
          for (m in params[k]) {
            step.push(params[k][m]);
          }

          if (step[0] != 'none') {
            if(step[0] > 0){
              OPCODE2.push(DIRop << 4 | 0x01);
              OPCODE1.push(0x00);
            }else{
              step[0] = -step[0];
              OPCODE2.push(DIRop << 4 | 0x00);
              OPCODE1.push(0x00);
            }

          }
          if (step[1] != 'none') {
            if(step[1] > 0){
              OPCODE2.push(DIRop << 4 | 0x05);
              OPCODE1.push(0x00);
            }else{
              step[1] = -step[1];
              OPCODE2.push(DIRop << 4 | 0x04);
              OPCODE1.push(0x00);
            }
          }
          if (step[2] != 'none') {
            if(step[2] > 0){
              OPCODE2.push(DIRop << 4 | 0x09);
              OPCODE1.push(0x00);
            }else{
              step[2] = -step[2];
              OPCODE2.push(DIRop << 4 | 0x08);
              OPCODE1.push(0x00);
            }
          }
          if (step[0] != 'none') {
            OPCODE2.push(MMop << 4 | (0x00 | (step[0] & 0x0300) >> 8));
            OPCODE1.push(step[0] & 0xFF);
          }
          if (step[1] != 'none') {
            OPCODE2.push(MMop << 4 | (0x04 | (step[1] & 0x0300) >> 8));
            OPCODE1.push(step[1] & 0xFF);
          }
          if (step[2] != 'none') {
            OPCODE2.push(MMop << 4 | (0x08 | (step[2] & 0x0300) >> 8));
            OPCODE1.push(step[2] & 0xFF);
          }
          if ((step[0] != 'none') | (step[1] != 'none') | (step[2] != 'none')) {
            OPCODE2.push(RUNop << 4 | 2);
            OPCODE1.push(0x00);
          }
        }
      break;
      case 'interpolar_abs':
        if (params[k] == "INICIO") {
          OPCODE2.push(GOHOMEop << 4);
          OPCODE1.push(0x00);
        } else if (params[k] == "FIM") {
          OPCODE2.push(GOTOop << 4 | 0x0D);
          OPCODE1.push(0x00);
        } else {

        let m = 0;
        let step = [];
        for (m in params[k]) {
          step.push(params[k][m]);
        }

        if (step[0] != 'none') {
          OPCODE2.push(MM_ABSop << 4 | (0x00 | (step[0] & 0x0300) >> 8));
          OPCODE1.push(step[0] & 0xFF);
        }
        if (step[1] != 'none') {
          OPCODE2.push(MM_ABSop << 4 | (0x04 | (step[1] & 0x0300) >> 8));
          OPCODE1.push(step[1] & 0xFF);
        }
        if (step[2] != 'none') {
          OPCODE2.push(MM_ABSop << 4 | (0x08 | (step[2] & 0x0300) >> 8));
          OPCODE1.push(step[2] & 0xFF);
        }
        if ((step[0] != 'none') | (step[1] != 'none') | (step[2] != 'none')) {
          OPCODE2.push(RUNop << 4 | 2);
          OPCODE1.push(0x00);
        }
      }
      break;
      case 'mover':
        if (params[k] == "INICIO") {
          OPCODE2.push(GOHOMEop << 4);
          OPCODE1.push(0x00);
        } else if (params[k] == "FIM") {
          OPCODE2.push(GOTOop << 4 | 0x0D);
          OPCODE1.push(0x00);
        } else {
          let m = 0;
          let step = [];
          let dir;
          for (m in params[k]) {
            step.push(params[k][m]);
          }

          if (step[0] != 'none') {
            if(step[0] > 0){
              OPCODE2.push(DIRop << 4 | 0x01);
              OPCODE1.push(0x00);
            }else{
              step[0] = -step[0];
              OPCODE2.push(DIRop << 4 | 0x00);
              OPCODE1.push(0x00);
            }

          }
          if (step[1] != 'none') {
            if(step[1] > 0){
              OPCODE2.push(DIRop << 4 | 0x05);
              OPCODE1.push(0x00);
            }else{
              step[1] = -step[1];
              OPCODE2.push(DIRop << 4 | 0x04);
              OPCODE1.push(0x00);
            }
          }
          if (step[2] != 'none') {
            if(step[2] > 0){
              OPCODE2.push(DIRop << 4 | 0x09);
              OPCODE1.push(0x00);
            }else{
              step[2] = -step[2];
              OPCODE2.push(DIRop << 4 | 0x08);
              OPCODE1.push(0x00);
            }
          }
          if (step[0] != 'none') {
            OPCODE2.push(MMop << 4 | (0x00 | (step[0] & 0x0300) >> 8));
            OPCODE1.push(step[0] & 0xFF);
          }
          if (step[1] != 'none') {
            OPCODE2.push(MMop << 4 | (0x04 | (step[1] & 0x0300) >> 8));
            OPCODE1.push(step[1] & 0xFF);
          }
          if (step[2] != 'none') {
            OPCODE2.push(MMop << 4 | (0x08 | (step[2] & 0x0300) >> 8));
            OPCODE1.push(step[2] & 0xFF);
          }
          if ((step[0] != 'none') | (step[1] != 'none') | (step[2] != 'none')) {
            OPCODE2.push(RUNop << 4 | 1);
            OPCODE1.push(0x00);
          }
        }
      break;

      case 'mover_abs':
        if (params[k] == "INICIO") {
          OPCODE2.push(GOHOMEop << 4);
          OPCODE1.push(0x00);
        } else if (params[k] == "FIM") {
          OPCODE2.push(GOTOop << 4 | 0x0D);
          OPCODE1.push(0x00);
        } else {


        let n = 0;
        let step_m = [];
        for (n in params[k]) {
          step_m.push(params[k][n]);
        }

        if (step_m[0] != 'none') {
          OPCODE2.push(MM_ABSop << 4 | (0x00 | (step_m[0] & 0x0300) >> 8));
          OPCODE1.push(step_m[0] & 0xFF);
        }
        if (step_m[1] != 'none') {
          OPCODE2.push(MM_ABSop << 4 | (0x04 | (step_m[1] & 0x0300) >> 8));
          OPCODE1.push(step_m[1] & 0xFF);
        }
        if (step_m[2] != 'none') {
          OPCODE2.push(MM_ABSop << 4 | (0x08 | (step_m[2] & 0x0300) >> 8));
          OPCODE1.push(step_m[2] & 0xFF);
        }
        if ((step_m[0] != 'none') | (step_m[1] != 'none') | (step_m[2] != 'none')) {
          OPCODE2.push(RUNop << 4 | 1);
          OPCODE1.push(0x00);
        }
      }
      break;

      case 'esperar':
        OPCODE2.push(DELAYop << 4 | ((params[k] & 0x0F00) >> 8));
        OPCODE1.push(params[k] & 0xFF);
        break;
      case 'acionar':
        OPCODE2.push(OUTop << 4 | ((params[k] & 0x07) << 1 | 1));
        OPCODE1.push(0x00);
        break;
      case 'desacionar':
        OPCODE2.push(OUTop << 4 | ((params[k] & 0x07) << 1));
        OPCODE1.push(0x00);
        break;
      case 'confirma':
        let m = 0;
        let para = [];
        let level;
        for (m in params[k]) {
          para.push(params[k][m]);
        }

        level = (para[1] == 'alto')? 0x01 : 0x00;

        OPCODE2.push(WAITFORop << 4 | ((para[0] & 0x07) << 1 | level));
        OPCODE1.push(0x00);
        break;

      case 'velocidade':
        let i = 0;
        let vel = [];
        for (i in params[k]) {
          vel.push(params[k][i]);
        }

        if (vel[0] != 'none') {
          OPCODE2.push(SETop << 4 | (0x00 | (vel[0] & 0x0300) >> 8));
          OPCODE1.push(vel[0] & 0xFF);
        }

        if (vel[1] != 'none') {
          OPCODE2.push(SETop << 4 | (0x04 | (vel[0] & 0x0300) >> 8));
          OPCODE1.push(vel[0] & 0xFF);
        }

        if (vel[2] != 'none') {
          OPCODE2.push(SETop << 4 | (0x08 | (vel[0] & 0x0300) >> 8));
          OPCODE1.push(vel[0] & 0xFF);
        }
        break;

      default:
        OPCODE2.push(0x00);
        OPCODE1.push(0x00);
    }
  }
  OPCODE2.push(0x00);
  OPCODE1.push(0x00);
  // console.log(OPCODE2);
  // console.log(OPCODE1);
  return [OPCODE2, OPCODE1];
}

function uncode(CMDS, MOTION) {
  let programa = {
    id: 0,
    name: "Programa " + 0,
    qtd_cmmds: 0,
    cmmds: []
  };
  programa.id = MOTION;
  programa.name = "Programa " + MOTION;

  let GOMM = [0, 0, 0];
  let flagGOMM = false;
  let contGOMM = 0;
  let valueGOMM = 0;

  let MM_ABS = [0, 0, 0];
  let flagMM_ABS = false;
  let contMM_ABS = 0;
  let valueMM_ABS = 0;

  let MM = [0, 0, 0];
  let DIR = [1, 1, 1];
  let flagMM = false;
  let contMM = 0;
  let valueMM = 0;

  let SET = [0, 0, 0];
  let flagSET = false;
  let contSET = 0;
  let valueSET = 0;

  let i = 0;
  for (i = 0; i < CMDS.length; i++) {
    let op_2 = CMDS[i][0];
    let op_1 = CMDS[i][1];
    let opcode = (op_2 >> 4) & 0x0F;

    let len = 0;
    let motor;
    let steps;
    let end = false;
    let interpolar = false;

    switch (opcode) {
      case GOHOMEop:
        programa.cmmds.push({ 'mover': 'INICIO' });
        break;

      case GOTOop:
        programa.cmmds.push({ 'mover': 'FIM' });
        break;

      case DELAYop:
        programa.cmmds.push({ 'esperar': 0 });
        len = programa.cmmds.length;
        programa.cmmds[len - 1].esperar = Number(((op_2 & 0x0F) << 8) | op_1);
        break;

      case OUTop:
        let mode = Number(op_2 & 0x01);
        let out = Number((op_2 >> 1) & 0x7);
        len = programa.cmmds.length;

        if (mode == 1) {
          programa.cmmds.push({ 'acionar': 0 });
          programa.cmmds[len].acionar = out;
        } else if (mode == 0) {
          programa.cmmds.push({ 'desacionar': 0 });
          programa.cmmds[len].desacionar = out;
        }
        break;

      case WAITFORop:
        let level = Number(op_2 & 0x01);
        let input = Number((op_2 >> 1) & 0x7);
        len = programa.cmmds.length;

        if(level == 1){
          programa.cmmds.push({ 'confirma': {'in': 0, 'nivel':'alto'}});
          programa.cmmds[len].confirma.in = input;
        }else{
          programa.cmmds.push({ 'confirma': {'in': 0, 'nivel':'baixo'}});
          programa.cmmds[len].confirma.in = input;
        }
        break;

      case DIRop:
        let dir = Number(op_2 & 0x01);
        motor = Number((op_2 >> 2) & 0x03);
        DIR[motor] = dir;
        break;

      case MMop:
        motor = Number((op_2 >> 2) & 0x03);
        steps = Number(((op_2 & 0x03) << 8) | op_1);
        MM = ['none', 'none', 'none'];
        MM[motor] = steps;
        len = programa.cmmds.length;

        contMM ++;
        if((contMM > valueMM ) && flagMM ){
          flagMM = false;
        }
        end = false;

        if (!flagMM) {
          switch (motor) {
            case 0:  // motor x
              if (((CMDS[i + 1][0] >> 4) & 0x0F) == MMop) {
                op_2 = CMDS[i + 1][0];
                op_1 = CMDS[i + 1][1];

                motor = Number((op_2 >> 2) & 0x03);
                steps = Number(((op_2 & 0x03) << 8) | op_1);
                MM[motor] = DIR[motor]*steps;

                if (((CMDS[i + 2][0] >> 4) & 0x0F) == MMop) {
                  op_2 = CMDS[i + 2][0];
                  op_1 = CMDS[i + 2][1];
                  motor = Number((op_2 >> 2) & 0x03);
                  steps = Number(((op_2 & 0x03) << 8) | op_1);
                  MM[motor] = DIR[motor]*steps;
                  if(((CMDS[i + 3][0] >> 4) & 0x0F) == RUNop) {
                    end = true;
                    flagMM = true;
                    contMM = 0;
                    valueMM = 2;
                    interpolar = ((CMDS[i + 3][0] & 0x02) == 0x02)? true : false;
                  }
                }else if(((CMDS[i + 2][0] >> 4) & 0x0F) == RUNop) {
                  end = true;
                  flagMM = true;
                  contMM = 0;
                  valueMM = 1;
                  interpolar = ((CMDS[i + 2][0] & 0x02) == 0x02)? true : false;
                }
              }else if(((CMDS[i + 1][0] >> 4) & 0x0F) == RUNop) {
                end = true;
                interpolar = ((CMDS[i + 1][0] & 0x02) == 0x02)? true : false;
              }

              if(end){
                if(interpolar){
                  programa.cmmds.push({ 'interporlar': { "x": "none", "y": "none", "z": "none" } });
                  programa.cmmds[len].interporlar.x = DIR[0]*MM[0];
                  programa.cmmds[len].interporlar.y = MM[1];
                  programa.cmmds[len].interporlar.z = MM[2];
                }else{
                  programa.cmmds.push({ 'mover': { "x": "none", "y": "none", "z": "none" } });
                  programa.cmmds[len].mover.x = DIR[0]*MM[0];
                  programa.cmmds[len].mover.y = MM[1];
                  programa.cmmds[len].mover.z = MM[2];
                }
              }
              break;

            case 1: // motor y
              if (((CMDS[i + 1][0] >> 4) & 0x0F) == MMop) {
                op_2 = CMDS[i + 1][0];
                op_1 = CMDS[i + 1][1];
                motor = Number((op_2 >> 2) & 0x03);
                steps = Number(((op_2 & 0x03) << 8) | op_1);
                MM[motor] = DIR[motor]*steps;

                if(((CMDS[i + 2][0] >> 4) & 0x0F) == RUNop) {
                  end = true;
                  flagMM = true;
                  contMM = 0;
                  valueMM = 1;
                  interpolar = ((CMDS[i + 2][0] & 0x02) == 0x02)? true : false;
                }
              }else if(((CMDS[i + 1][0] >> 4) & 0x0F) == RUNop) {
                end = true;
                interpolar = ((CMDS[i + 1][0] & 0x02) == 0x02)? true : false;
              }

              if(end){
                if(interpolar){
                  programa.cmmds.push({ 'interpolar': { "x": "none", "y": "none", "z": "none" } });
                  programa.cmmds[len].interpolar.y = DIR[1]*MM[1];
                  programa.cmmds[len].interpolar.z = MM[2];
                }else {
                  programa.cmmds.push({ 'mover': { "x": "none", "y": "none", "z": "none" } });
                  programa.cmmds[len].mover.y = DIR[1]*MM[1];
                  programa.cmmds[len].mover.z = MM[2];
                }
              }
              break;

            case 2: // motor z
              if(((CMDS[i + 1][0] >> 4) & 0x0F) == RUNop) {
                if((CMDS[i + 1][0] & 0x02) == 0x02){
                  programa.cmmds.push({ 'interpolar': { "x": "none", "y": "none", "z": "none" } });
                  programa.cmmds[len].interpolar.z = DIR[2]*MM[2];
                }else{
                  programa.cmmds.push({ 'mover': { "x": "none", "y": "none", "z": "none" } });
                  programa.cmmds[len].mover.z = DIR[2]*MM[2];
                }
              }
              break;
          }
        }
        break;

      case MM_ABSop:
          motor = Number((op_2 >> 2) & 0x03);
          steps = Number(((op_2 & 0x03) << 8) | op_1);
          MM_ABS = ['none', 'none', 'none'];
          MM_ABS[motor] = steps;
          len = programa.cmmds.length;

          contMM_ABS ++;
          if((contMM_ABS > valueMM_ABS ) && flagMM_ABS ){
            flagMM_ABS = false;
          }
          end = false;

          if (!flagMM_ABS) {
            switch (motor) {
              case 0:  // motor x
                if (((CMDS[i + 1][0] >> 4) & 0x0F) == MM_ABSop) {
                  op_2 = CMDS[i + 1][0];
                  op_1 = CMDS[i + 1][1];

                  motor = Number((op_2 >> 2) & 0x03);
                  steps = Number(((op_2 & 0x03) << 8) | op_1);
                  MM_ABS[motor] = steps;

                  if (((CMDS[i + 2][0] >> 4) & 0x0F) == MM_ABSop) {
                    op_2 = CMDS[i + 2][0];
                    op_1 = CMDS[i + 2][1];
                    motor = Number((op_2 >> 2) & 0x03);
                    steps = Number(((op_2 & 0x03) << 8) | op_1);
                    MM_ABS[motor] = steps;
                    if(((CMDS[i + 3][0] >> 4) & 0x0F) == RUNop) {
                      end = true;
                      flagMM_ABS = true;
                      contMM_ABS = 0;
                      valueMM_ABS = 2;
                      interpolar = ((CMDS[i + 3][0] & 0x02) == 0x02)? true : false;
                    }
                  }else if(((CMDS[i + 2][0] >> 4) & 0x0F) == RUNop) {
                    end = true;
                    flagMM_ABS = true;
                    contMM_ABS = 0;
                    valueMM_ABS = 1;
                    interpolar = ((CMDS[i + 2][0] & 0x02) == 0x02)? true : false;
                  }
                }else if(((CMDS[i + 1][0] >> 4) & 0x0F) == RUNop) {
                  end = true;
                  interpolar = ((CMDS[i + 1][0] & 0x02) == 0x02)? true : false;
                }

                if(end){
                  if(interpolar){
                    programa.cmmds.push({ 'interpolar_abs': { "x": "none", "y": "none", "z": "none" } });
                    programa.cmmds[len].interpolar_abs.x = MM_ABS[0];
                    programa.cmmds[len].interpolar_abs.y = MM_ABS[1];
                    programa.cmmds[len].interpolar_abs.z = MM_ABS[2];
                  }else{
                    programa.cmmds.push({ 'mover_abs': { "x": "none", "y": "none", "z": "none" } });
                    programa.cmmds[len].mover_abs.x = MM_ABS[0];
                    programa.cmmds[len].mover_abs.y = MM_ABS[1];
                    programa.cmmds[len].mover_abs.z = MM_ABS[2];
                  }
                }
                break;

              case 1: // motor y
                if (((CMDS[i + 1][0] >> 4) & 0x0F) == MM_ABSop) {
                  op_2 = CMDS[i + 1][0];
                  op_1 = CMDS[i + 1][1];
                  motor = Number((op_2 >> 2) & 0x03);
                  steps = Number(((op_2 & 0x03) << 8) | op_1);
                  MM_ABS[motor] = steps;

                  if(((CMDS[i + 2][0] >> 4) & 0x0F) == RUNop) {
                    end = true;
                    flagMM_ABS = true;
                    contMM_ABS = 0;
                    valueMM_ABS = 1;
                    interpolar = ((CMDS[i + 2][0] & 0x02) == 0x02)? true : false;
                  }
                }else if(((CMDS[i + 1][0] >> 4) & 0x0F) == RUNop) {
                  end = true;
                  interpolar = ((CMDS[i + 1][0] & 0x02) == 0x02)? true : false;
                }

                if(end){
                  if(interpolar){
                    programa.cmmds.push({ 'interpolar_abs': { "x": "none", "y": "none", "z": "none" } });
                    programa.cmmds[len].interpolar_abs.y = MM_ABS[1];
                    programa.cmmds[len].interpolar_abs.z = MM_ABS[2];
                  }else{
                    programa.cmmds.push({ 'mover_abs': { "x": "none", "y": "none", "z": "none" } });
                    programa.cmmds[len].mover_abs.y = MM_ABS[1];
                    programa.cmmds[len].mover_abs.z = MM_ABS[2];
                  }
                }
                break;

              case 2: // motor z
                if(((CMDS[i + 1][0] >> 4) & 0x0F) == RUNop) {
                  if((CMDS[i + 1][0] & 0x02) == 0x02){
                    programa.cmmds.push({ 'interpolar_abs': { "x": "none", "y": "none", "z": "none" } });
                    programa.cmmds[len].interpolar_abs.z = MM_ABS[2];
                  }else{
                    programa.cmmds.push({ 'mover_abs': { "x": "none", "y": "none", "z": "none" } });
                    programa.cmmds[len].mover_abs.z = MM_ABS[2];
                  }
                }
                break;
            }
          }
          break;

      case GOMMop:
        motor = Number((op_2 >> 2) & 0x03);
        steps = Number(((op_2 & 0x03) << 8) | op_1);

        GOMM = ['none', 'none', 'none'];
        GOMM[motor] = steps;
        len = programa.cmmds.length;

        contGOMM ++;
        if((contGOMM > valueGOMM ) && flagGOMM ){
          flagGOMM = false;
        }

        if (!flagGOMM) {
          switch (motor) {
            case 0:  // motor x
              op_2 = CMDS[i + 1][0];
              op_1 = CMDS[i + 1][1];
              motor = Number((op_2 >> 2) & 0x03);
              if ((((op_2 >> 4) & 0x0F) == GOMMop) && (motor == 1)) { //motor y
                steps = Number(((op_2 & 0x03) << 8) | op_1);
                GOMM[motor] = steps;
                op_2 = CMDS[i + 2][0];
                op_1 = CMDS[i + 2][1];
                motor = Number((op_2 >> 2) & 0x03);
                if ((((op_2 >> 4) & 0x0F) == GOMMop) && (motor == 2)) { //motor z
                  steps = Number(((op_2 & 0x03) << 8) | op_1);
                  GOMM[motor] = steps;

                  flagGOMM = true;
                  valueGOMM = 2;
                  contGOMM = 0;
                }else{
                  flagGOMM = true;
                  valueGOMM = 1;
                  contGOMM = 0;
                }
              } else if ((((op_2 >> 4) & 0x0F) == GOMMop) && (motor == 2)) { //motor z
                steps = Number(((op_2 & 0x03) << 8) | op_1);
                GOMM[motor] = steps;

                flagGOMM = true;
                valueGOMM = 1;
                contGOMM = 0;
              }

              programa.cmmds.push({ 'mover_abs': { "x": "none", "y": "none", "z": "none" } });
              programa.cmmds[len].mover_abs.x = GOMM[0];
              programa.cmmds[len].mover_abs.y = GOMM[1];
              programa.cmmds[len].mover_abs.z = GOMM[2];
              break;

            case 1: // motor y
              op_2 = CMDS[i + 1][0];
              op_1 = CMDS[i + 1][1];
              motor = Number((op_2 >> 2) & 0x03);
              if ((((op_2 >> 4) & 0x0F) == GOMMop) && (motor == 2)) { //motor z
                steps = Number(((op_2 & 0x03) << 8) | op_1);
                GOMM[motor] = steps;
                programa.cmmds.push({ 'mover_abs': { "x": "none", "y": "none", "z": "none" } });
                programa.cmmds[len].mover_abs.y = GOMM[1];
                programa.cmmds[len].mover_abs.z = GOMM[2];

                flagGOMM = true;
                contGOMM = 0;
                valueGOMM = 1;
              }
              break;

            case 2: // motor z
              programa.cmmds.push({ 'mover_abs': { "x": "none", "y": "none", "z": "none" } });
              programa.cmmds[len].mover_abs.z = GOMM[2];
              break;
          }
        }
        break;

      case SETop:
        let vel = 0;
        motor = Number((op_2 >> 2) & 0x03);
        vel = Number(((op_2 & 0x03) << 8) | op_1);

        SET = ['none', 'none', 'none'];
        SET[motor] = vel;
        len = programa.cmmds.length;

        contSET ++;
        if((contSET > valueSET ) && flagSET ){
          flagSET = false;
        }

        if (!flagSET) {
          switch (motor) {
            case 0:  // motor x
              op_2 = CMDS[i + 1][0];
              op_1 = CMDS[i + 1][1];
              motor = Number((op_2 >> 2) & 0x03);

              if ((((op_2 >> 4) & 0x0F) == SETop) && (motor == 1)) { //motor y
                vel = Number(((op_2 & 0x03) << 8) | op_1);
                SET[motor] = vel;

                op_2 = CMDS[i + 2][0];
                op_1 = CMDS[i + 2][1];
                motor = Number((op_2 >> 2) & 0x03);
                if ((((op_2 >> 4) & 0x0F) == SETop) && (motor == 2)) { //motor z
                  vel = Number(((op_2 & 0x03) << 8) | op_1);
                  SET[motor] = vel;

                  flagSET = true;
                  valueSET = 2;
                  contSET = 0;
                }else{
                  flagSET = true;
                  valueSET = 1;
                  contSET = 0;
                }
              } else if ((((op_2 >> 4) & 0x0F) == SETop) && (motor == 2)) { //motor z
                vel = Number(((op_2 & 0x03) << 8) | op_1);
                SET[motor] = vel;

                flagSET = true;
                valueSET = 1;
                contSET = 0;
              }

              programa.cmmds.push({ 'velocidade': { "x": "none", "y": "none", "z": "none" } });
              programa.cmmds[len].velocidade.x = SET[0];
              programa.cmmds[len].velocidade.y = SET[1];
              programa.cmmds[len].velocidade.z = SET[2];
              break;

            case 1: // motor y
              op_2 = CMDS[i + 1][0];
              op_1 = CMDS[i + 1][1];
              motor = Number((op_2 >> 2) & 0x03);
              if ((((op_2 >> 4) & 0x0F) == SETop) && (motor == 2)) { //motor z
                vel = Number(((op_2 & 0x03) << 8) | op_1);
                SET[motor] = vel;
                programa.cmmds.push({ 'velocidade': { "x": "none", "y": "none", "z": "none" } });
                programa.cmmds[len].velocidade.y = SET[1];
                programa.cmmds[len].velocidade.z = SET[2];

                flagSET = true;
                contSET = 0;
                valueSET = 1;
              }
              break;

          case 2: // motor z
            programa.cmmds.push({ 'velocidade': { "x": "none", "y": "none", "z": "none" } });
            programa.cmmds[len].velocidade.z = SET[2];
            break;
          }
        }
      break;
    }
  }

  programa.qtd_cmmds = programa.cmmds.length;

  return programa;
}

async function load_cmd(MOTION) {
  const CS = (0x00 - (0x3E + LOADcmd + MOTION)) & 0xFF;
  const CMD = [0x3E, LOADcmd, MOTION, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == LOADcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

async function execute_cmd(OPCODE1, OPCODE2) {
  const CS = (0x00 - (0x3E + EXECUTEcmd + OPCODE1 + OPCODE2)) & 0xFF;
  const CMD = [0x3E, EXECUTEcmd, OPCODE1, OPCODE2, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == EXECUTEcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    console.log(`Erro-exe: ${res}`);
    return false;
  }
}

async function set_param_cmd(PARAM, VALUE1, VALUE2) {
  const CS = (0x00 - (0x3E + SET_PARAMcmd + PARAM + VALUE1 + VALUE2)) & 0xFF;
  const CMD = [0x3E, SET_PARAMcmd, PARAM, VALUE1, VALUE2, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == SET_PARAMcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

async function write_cmd(STEP, OPCODE1, OPCODE2) {
  const CS = (0x00 - (0x3E + WRITEcmd + STEP + OPCODE1 + OPCODE2)) & 0xFF;
  const CMD = [0x3E, WRITEcmd, STEP, OPCODE1, OPCODE2, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == WRITEcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

async function update_cmd() {
  const CS = (0x00 - (0x3E + UPDATEcmd)) & 0xFF;
  const CMD = [0x3E, UPDATEcmd, 0x00, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == UPDATEcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

async function read_cmd(STEP) {
  const CS = (0x00 - (0x3E + READcmd + STEP)) & 0xFF;
  const CMD = [0x3E, READcmd, STEP, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == READcmd) && (res[2] == 0xC0)) {
    return [res[3], res[4]];
  } else {
    return false;
  }
}

async function read_pos_x_cmd() {
  const CS = (0x00 - (0x3E + READ_POScmd + 0)) & 0xFF;
  const CMD = [0x3E, READ_POScmd, 0x00, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponseEncoderX(70);

  if ((res[1] == READ_POScmd) && (res[2] == 0x00)) {
    let pos = Number((res[3] << 8) | res[4]);
    return pos;
  } else {
    return 0;
  }
}

async function read_pos_y_cmd() {
  const CS = (0x00 - (0x3E + READ_POScmd + 0x01)) & 0xFF;
  const CMD = [0x3E, READ_POScmd, 0x01, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponseEncoderY(70);

  if ((res[1] == READ_POScmd) && (res[2] == 0x01)) {
    let pos = Number((res[3] << 8) | res[4]);
    return pos;
  } else {
    return 0;
  }
}


async function read_pos_z_cmd() {
  const CS = (0x00 - (0x3E + READ_POScmd + 0x02)) & 0xFF;
  const CMD = [0x3E, READ_POScmd, 0x02, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponseEncoderZ(70);

  if ((res[1] == READ_POScmd) && (res[2] == 0x02)) {
    let pos = Number((res[3] << 8) | res[4]);
    return pos;
  } else {
    return 0;
  }
}

async function run_cmd(MOTION) {
  const CS = (0x00 - (0x3E + RUNcmd + MOTION)) & 0xFF;
  const CMD = [0x3E, RUNcmd, MOTION, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  // console.log(res);

  if ((res[1] == RUNcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

async function stop_cmd() {
  const CS = (0x00 - (0x3E + STOPcmd)) & 0xFF;
  const CMD = [0x3E, STOPcmd, 0x00, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == STOPcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

async function ack_cmd() {
  const CS = (0x00 - (0x3E + ACKcmd)) & 0xFF;
  const CMD = [0x3E, ACKcmd, 0x00, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponseAck(70);

  if ((res[1] == ACKcmd) && (res[2] == 0xC0)) {
    return res[3];
  } else {
    return false;
  }
}

async function axesFree_cmd(mode) {
  const CS = (0x00 - (0x3E + AXES_FREEcmd + mode)) & 0xFF;
  const CMD = [0x3E, AXES_FREEcmd, mode, 0x00, 0x00, CS];
  queueComand.enqueue(CMD);

  const res = await waitResponse(70);

  if ((res[1] == AXES_FREEcmd) && (res[2] == 0xC0)) {
    return true;
  } else {
    return false;
  }
}

// Functions wait
function waitResponse(time){
  let cont = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      cont++;
      if (!queueResponse.isEmpty()) {
        clearInterval(interval);
        let response = queueResponse.peek();
        queueResponse.dequeue();

        if ( response[2] != 0xC0) {
          console.log(`Erro: ${response}`);
        }

        resolve(response);
      }
      if(cont > 20 ){
        clearInterval(interval);
        resolve([0x00]);
      }
    // }, 200); // Para o teste passar, precisa-se comentar esta linha e usar isso -> }, 10);
        }, 10);
  });
}

function waitResponseEncoderX(time) {
  let cont = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      cont++;
      if (!queueResponseEncoderX.isEmpty()) {
        clearInterval(interval);
        let response = queueResponseEncoderX.peek();
        queueResponseEncoderX.dequeue();
        resolve(response);
      }
      if(cont > 0 ){
        clearInterval(interval);
        resolve([0x00]);
      }
    // }, 200); // Para o teste passar, precisa-se comentar esta linha e usar isso -> }, 10);
        }, 10);
  });
}

function waitResponseEncoderY(time) {
  let cont = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      cont++;
      if (!queueResponseEncoderY.isEmpty()) {
        clearInterval(interval);
        let response = queueResponseEncoderY.peek();
        queueResponseEncoderY.dequeue();
        resolve(response);
      }
      if(cont > 0 ){
        clearInterval(interval);
        resolve([0x00]);
      }
    // }, 200);   // Para o teste passar, precisa-se comentar esta linha e usar isso -> }, 10);  
    }, 10);
  });
}

function waitResponseEncoderZ(time) {
  let cont = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      cont++;
      if (!queueResponseEncoderZ.isEmpty()) {
        clearInterval(interval);
        let response = queueResponseEncoderZ.peek();
        queueResponseEncoderZ.dequeue();
        resolve(response);
      }
      if(cont > 0 ){
        clearInterval(interval);
        resolve([0x00]);
      }
    // }, 200); // Para o teste passar, precisa-se comentar esta linha e usar isso -> }, 10);
        }, 10);
  });
}

function waitResponseAck(time) {
  let cont = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      cont++;
      if (!queueResponseAck.isEmpty()) {
        clearInterval(interval);
        let response = queueResponseAck.peek();
        queueResponseAck.dequeue();
        resolve(response);
      }
      if(cont > 0 ){
        clearInterval(interval);
        resolve([0x00]);
      }
    // }, 200); // Para o teste passar, precisa-se comentar esta linha e usar isso -> }, 10);
        }, 10);
  });
}

async function waitfinish(){
  let cont = 0;
  let encoder;
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      let response;
      cont++;

      encoder = await readPosition();
      //io.emit('/encoder', encoder);  // Para o teste passar, precisa-se comentar esta linha

      response  = await ack_cmd();
      if(response == 0){
        clearInterval(interval);
        resolve(true);
      }
      if(cont > 100 ){
        clearInterval(interval);
        resolve(false);
      }
  // }, 500); // Para o teste passar, precisa-se comentar esta linha e usar isso -> }, 100);
  }, 100);
  });
}

module.exports = {
  calibration,
  goHome,
  step,
  stop,
  run,
  setSize,
  write,
  read,
  clearMotion,
  readPosition,
  ack,
  axesFree,
  execute,
  updateGains,
}
