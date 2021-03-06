import { expect } from 'chai';

import queueComand from '../../src/Queue/queueComand';
import queueResponse from '../../src/Queue/queueResponse';
import queueResponseEncoderX from '../../src/Queue/queueResponseEncoderX';
import queueResponseEncoderY from '../../src/Queue/queueResponseEncoderY';
import queueResponseEncoderZ from '../../src/Queue/queueResponseEncoderZ';
import queueResponseAck from '../../src/Queue/queueResponseAck';
import {calibration, goHome, step, stop, run, setSize, write, read, clearMotion, readPosition, ack, axesFree, execute, updateGains} from '../../src/cnc/driver';

describe('Drive', () => {

  describe('Smoke tests', () =>{
    it('shold exist the method `calibration`', () => {
      expect(calibration).to.exist;
      expect(calibration).to.be.a('function');
    });

    it('shold exist the method `goHome`', () => {
      expect(goHome).to.exist;
      expect(goHome).to.be.a('function');
    });

    it('shold exist the method `step`', () => {
      expect(step).to.exist;
      expect(step).to.be.a('function');
    });

    it('shold exist the method `stop`', () => {
      expect(stop).to.exist;
      expect(stop).to.be.a('function');
    });

    it('shold exist the method `run`', () => {
      expect(run).to.exist;
      expect(run).to.be.a('function');
    });

    it('shold exist the method `setSize`', () => {
      expect(setSize).to.exist;
      expect(setSize).to.be.a('function');
    });

    it('shold exist the method `write`', () => {
      expect(write).to.exist;
      expect(write).to.be.a('function');
    });

    it('shold exist the method `read`', () => {
      expect(read).to.exist;
      expect(read).to.be.a('function');
    });

    it('shold exist the method `clearMotion`', () => {
      expect(clearMotion).to.exist;
      expect(clearMotion).to.be.a('function');
    });

    it('shold exist the method `readPosition`', () => {
      expect(readPosition).to.exist;
      expect(readPosition).to.be.a('function');
    });

    it('shold exist the method `ack`', () => {
      expect(ack).to.exist;
      expect(ack).to.be.a('function');
    });

    it('shold exist the method `axesFree`', () => {
      expect(axesFree).to.exist;
      expect(axesFree).to.be.a('function');
    });

    it('shold exist the method `execute`', () => {
      expect(execute).to.exist;
      expect(execute).to.be.a('function');
    });

    it('shold exist the method `updateGains`', () => {
      expect(updateGains).to.exist;
      expect(updateGains).to.be.a('function');
    });

  });

  describe('Calibration', ()=>{
    let CS;
    let arr;
    CS = (0x00 -(0x3E + 0xA2 +  0xC0 + 0x00 + 0x0A))&0xFF;
    arr = [0x3E, 0xA2 , 0xC0, 0x00, 0x0A, CS];

    beforeEach(() => {
      queueComand.clear();
      queueResponse.enqueue(arr);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await calibration(true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold have length 6', async () => {
      let res = await calibration(true);
      const CMD = queueComand.peek();
      expect(CMD.length).to.be.equal(6);
    });

    it('shold put the array of comand calibration', async () => {
      let res = await calibration(true);

      const buf = [0x3E, 0xA2, 0x6C, 0x00, 0x00, 0xB4];
      const CMD = queueComand.peek();

      expect(CMD[0]).to.be.equal(buf[0]);
      expect(CMD[1]).to.be.equal(buf[1]);
      expect(CMD[2]).to.be.equal(buf[2]);
      expect(CMD[3]).to.be.equal(buf[3]);
      expect(CMD[4]).to.be.equal(buf[4]);
      expect(CMD[5]).to.be.equal(buf[5]);
    });

    it('shold have a response of comand calibration', async () => {
      let res = await calibration(true);
      expect(res).to.be.equal(true);
    });

  });

  describe('goHome', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xA2 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA2 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
    });

    it('shold return true', async () => {
      let res = await goHome(true);
      expect(res).to.be.equal(true);
    });

    it('shold put comands on list `queueComand`', async () => {
      let res = await goHome(true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 1 comand on list `queueComand`', async () => {
      let res = await goHome(true);
      expect(queueComand.size()).to.be.equal(1);
    });

    it('shold put the comand EXECUTE on list `queueComand`', async () => {
      let res = await goHome(true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA2);
      expect(CMD[2]).to.be.equal(0x50);
      expect(CMD[3]).to.be.equal(0x00);
      expect(CMD[4]).to.be.equal(0x00);
    });

  });

  describe('Step', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xA2 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA2 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
    });

    it('shold return true', async () => {
      // let res = await step('x', 200, false);
      // expect(res).to.be.equal(true);

      let res = await step('x', 20, true, true);
      expect(res).to.be.equal(true);
    });

    it('shold put comands on list `queueComand`', async () => {
      let res = await step('x', 200, false, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 1 comand on list `queueComand`', async () => {
      let res = await step('x', 200, false, true);
      expect(queueComand.size()).to.be.equal(1);
    });

    it('shold put the comand EXECUTE on list `queueComand`', async () => {
      let res = await step('x', 200, false,true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA2);
      expect(CMD[2]).to.be.equal(0xA0);
      expect(CMD[3]).to.be.equal(0xC8);
      expect(CMD[4]).to.be.equal(0x00);
    });
  });

  describe('Stop', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xA8 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA8 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
    });

    it('shold return true', async () => {
      let res = await stop(true);
      expect(res).to.be.equal(true);
    });

    it('shold put comands on list `queueComand`', async () => {
      let res = await stop(true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 1 comand on list `queueComand`', async () => {
      let res = await stop(true);
      expect(queueComand.size()).to.be.equal(1);
    });

    it('shold put the comand STOP on list `queueComand`', async () => {
      let res = await stop(true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA8);
      expect(CMD[2]).to.be.equal(0x00);
      expect(CMD[3]).to.be.equal(0x00);
      expect(CMD[4]).to.be.equal(0x00);
    });

  });

  describe('setSize', ()=>{
    let CS;
    let arr;

    let size_x = 20; //20cm.
    let size_y = 15; //15cm.
    let size_z = 8; //8cm.

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xA3 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA3 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA3 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA3 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA3 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA3 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

    });

    it('shold put comands on list `queueComand`', async () => {
      let res = await setSize(size_x,size_y,size_z,true);

      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 3 comands on list `queueComand`', async () => {
      let res = await setSize(size_x,size_y,size_z, true);

      expect(queueComand.size()).to.be.equal(3);
    });

    it('shold put comand `set_param` on list `queueComand`', async () => {
      let res = await setSize(size_x,size_y,size_z, true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(36);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(20);
    });

  });

  describe('Write', ()=>{
    let CS;
    let arr;
    let programa = {
      id: 10,
      qtd_cmmds: 6,
      cmmds: [ {"mover":"INICIO"},
                  {"mover_abs":{x: 300, y: 2, z: 1}},
                  {"mover":{x: 300, y: 2, z: 1}},
                  {"esperar": 200},
                  {"acionar": 2},
                  {"confirma": {"in": 1, "nivel": "alto"}},
                  {"desacionar": 2},
                  {"velocidade": {x: 20, y: 20, z: 20}}
                ]
    };

    beforeEach(() => {
      queueResponse.clear();
      queueComand.clear();
      queueResponseEncoderX.clear();
      queueResponseEncoderY.clear();
      queueResponseEncoderZ.clear();
      queueResponseAck.clear();

      CS = (0x00 -(0x3E + 0xA2 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA2 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x00 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xAA , 0x00, 0x00, 0x0A, CS];
      queueResponseEncoderX.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x01 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xAA , 0x01, 0x00, 0x0A, CS];
      queueResponseEncoderY.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x02 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xAA , 0x02, 0x00, 0x0A, CS];
      queueResponseEncoderZ.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA9 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA9 , 0xC0, 0x00, 0x0A, CS];
      queueResponseAck.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA1 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA1 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA4 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA4 , 0xC0, 0x00, 0x0A, CS];
      var i;
      for (i = 0; i < 20; i++) {
        queueResponse.enqueue(arr);
      }

      CS = (0x00 -(0x3E + 0xA5 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA5 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
    });

    it('shold return true', async () => {
      let res = await write(programa, true);
      expect(res).to.be.equal(true);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await write(programa, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 27 comnds on list `queueComand`', async () => {
      let res = await write(programa, true);
      expect(queueComand.size()).to.be.equal(27);
    });

    it('shold put comnd EXECUTE/READ_ENCODER/ACK/LOAD/WRITE/UPDATE on list `queueComand`', async () => {
      let res = await write(programa, true);
      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA2);
      queueComand.dequeue();

      var i = 0;
      for (i = 0; i < 3; i++) {
        CMD = queueComand.peek();
        expect(CMD[1]).to.be.equal(0xAA);
        queueComand.dequeue();
      }

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA9);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA1);
      queueComand.dequeue();

      i = 0;
      for (i = 0; i < 20; i++) {
        CMD = queueComand.peek();
        expect(CMD[1]).to.be.equal(0xA4);
        queueComand.dequeue();
      }

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA5);
      queueComand.dequeue();
    });
  });

  describe('Read', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();
      queueResponse.clear();

      CS = (0x00 -(0x3E + 0xA1 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA1 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 80 + 0x00))&0xFF;  //GOHOME
      arr = [0x3E, 0xA6 , 0xC0, 80, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 225 + 44))&0xFF;  //GOMM
      arr = [0x3E, 0xA6 , 0xC0, 225, 44, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 228 + 2))&0xFF; //GOMM
      arr = [0x3E, 0xA6 , 0xC0, 228, 2, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 232 + 1))&0xFF; //GOMM
      arr = [0x3E, 0xA6 , 0xC0, 232 , 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF; //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 228 + 2))&0xFF; //GOMM
      arr = [0x3E, 0xA6 , 0xC0, 228, 2, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 232 + 1)) & 0xFF; //GOMM
      arr = [0x3E, 0xA6, 0xC0, 232, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF; //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 232 + 1)) & 0xFF; //GOMM
      arr = [0x3E, 0xA6, 0xC0, 232, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF; //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 225 + 44)) & 0xFF;  //GOMM
      arr = [0x3E, 0xA6, 0xC0, 225, 44, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 232 + 1)) & 0xFF; //GOMM
      arr = [0x3E, 0xA6, 0xC0, 232, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF; //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 17)) & 0xFF;  //DIR
      arr = [0x3E, 0xA6, 0xC0, 17, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 21)) & 0xFF; //DIR
      arr = [0x3E, 0xA6, 0xC0, 21, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 25)) & 0xFF; //DIR
      arr = [0x3E, 0xA6, 0xC0, 25, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 209 + 44)) & 0xFF; //MM
      arr = [0x3E, 0xA6, 0xC0, 209, 44, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 212 + 2)) & 0xFF; //MM
      arr = [0x3E, 0xA6, 0xC0, 212, 2, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 216 + 1)) & 0xFF;//MM
      arr = [0x3E, 0xA6, 0xC0, 216, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF; //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);
      //
      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 21)) & 0xFF; //DIR
      arr = [0x3E, 0xA6, 0xC0, 21, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 25)) & 0xFF; //DIR
      arr = [0x3E, 0xA6, 0xC0, 25, 0, CS];
      queueResponse.enqueue(arr);


      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 212 + 2)) & 0xFF; //MM
      arr = [0x3E, 0xA6, 0xC0, 212, 2, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 216 + 1)) & 0xFF; //MM
      arr = [0x3E, 0xA6, 0xC0, 216, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF;  //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);
      //

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 25)) & 0xFF; //DIR
      arr = [0x3E, 0xA6, 0xC0, 25, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 216 + 1)) & 0xFF; //MM
      arr = [0x3E, 0xA6, 0xC0, 216, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF;  //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);
      //

      //
      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 17)) & 0xFF;  //DIR
      arr = [0x3E, 0xA6, 0xC0, 17, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 25)) & 0xFF; //DIR
      arr = [0x3E, 0xA6, 0xC0, 25, 0, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 209 + 44)) & 0xFF; //MM
      arr = [0x3E, 0xA6, 0xC0, 209, 44, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 216 + 1)) & 0xFF;//MM
      arr = [0x3E, 0xA6, 0xC0, 216, 1, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 33)) & 0xFF; //RUN
      arr = [0x3E, 0xA6, 0xC0, 33, 0x00, CS];
      queueResponse.enqueue(arr);

      //
      CS = (0x00 - (0x3E + 0xA6 + 0xC0 + 192 + 200)) & 0xFF;
      arr = [0x3E, 0xA6, 0xC0, 192, 200, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 53 + 0x00))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 53, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 115 + 0x00))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 115, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 52 + 0x00))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 52, 0x00, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB0 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB0, 0x14, CS];
      queueResponse.enqueue(arr); // SET Velocity x

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB4 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB4, 0x14, CS];
      queueResponse.enqueue(arr); // SET Velocity y

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB8 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB8, 0x14, CS];
      queueResponse.enqueue(arr);  // SET Velocity z

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB0 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB0, 0x14, CS];
      queueResponse.enqueue(arr); // SET Velocity x

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB8 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB8, 0x14, CS];
      queueResponse.enqueue(arr);  // SET Velocity z

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB4 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB4, 0x14, CS];
      queueResponse.enqueue(arr); // SET Velocity y

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB8 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB8, 0x14, CS];
      queueResponse.enqueue(arr);  // SET Velocity z

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0xB8 + 0x14))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0xB8, 0x14, CS];
      queueResponse.enqueue(arr);  // SET Velocity z

      CS = (0x00 -(0x3E + 0xA6 +  0xC0 + 0x00 + 0x00))&0xFF;
      arr = [0x3E, 0xA6 , 0xC0, 0x00, 0x00, CS];
      queueResponse.enqueue(arr);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await read(10, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold return a motion format in json', async () =>{
      let prog = {
        id: 10,
        "name":"Programa 10",
        qtd_cmmds: 17,
        cmmds: [{ "mover": "INICIO" },
        { "mover_abs": { x: 300, y: 2, z: 1 } },
        { "mover_abs": { x: 'none', y: 2, z: 1 } },
        { "mover_abs": { x: 'none', y: 'none', z: 1 } },
        { "mover_abs": { x: 300, y: 'none', z: 1 } },
        { "mover": { x: 300, y: 2, z: 1 } },
        { "mover": { x: 'none', y: 2, z: 1 } },
        { "mover": { x: 'none', y: 'none', z: 1 } },
        { "mover": { x: 300, y: 'none', z: 1 } },
        { "esperar": 200 },
        { "acionar": 2 },
        { "confirma": {'in': 1, 'nivel': 'alto'}},
        { "desacionar": 2 },
        { "velocidade": { x: 20, y: 20, z: 20 } },
        { "velocidade": { x: 20, y: "none", z: 20 } },
        { "velocidade": { x: "none", y: 20, z: 20 } },
        { "velocidade": { x: "none", y: "none", z: 20 }}]
      };

      let res = await read(10,true);

      var res_string = JSON.stringify(res);
      var prog_string = JSON.stringify(prog);

      expect(res_string).to.be.equal(prog_string);
    });

  });

  describe('Clear Motion', () => {
    let CS;
    let arr;
    let motion = 10;

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xA1 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA1 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA4 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA4 , 0xC0, 0x00, 0x0A, CS];
      var i;
      for (i = 0; i < 64; i++) {
        queueResponse.enqueue(arr);
      }

      CS = (0x00 -(0x3E + 0xA5 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA5 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await clearMotion(motion, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 66 comnds on list `queueComand`', async () => {
      let res = await clearMotion(motion, true);
      expect(queueComand.size()).to.be.equal(66);
    });

    it('shold put comnd LOAD/WRITE/UPDATE on list `queueComand`', async () => {
      let res = await clearMotion(motion, true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA1);
      queueComand.dequeue();

      var i = 0;
      for (i = 0; i < 64; i++) {
        CMD = queueComand.peek();
        expect(CMD[1]).to.be.equal(0xA4);
        queueComand.dequeue();
      }

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA5);
      queueComand.dequeue();
    });
  });

  describe('Run Motion', () => {
    let CS;
    let arr;
    let motion = 10;

    beforeEach(() => {
      queueResponse.clear();
      queueComand.clear();
      queueResponseEncoderX.clear();
      queueResponseEncoderY.clear();
      queueResponseEncoderZ.clear();
      queueResponseAck.clear();

      CS = (0x00 -(0x3E + 0xA7 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA7 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x00 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xAA , 0x00, 0x00, 0x0A, CS];
      queueResponseEncoderX.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x00 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xAA , 0x01, 0x00, 0x0A, CS];
      queueResponseEncoderY.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x02 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xAA , 0x02, 0x00, 0x0A, CS];
      queueResponseEncoderZ.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA9 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA9 , 0xC0, 0x00, 0x0A, CS];
      queueResponseAck.enqueue(arr);
    });

    it('shold return true', async () => {
      let res = await run(motion, true);
      expect(res).to.be.equal(true);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await run(motion, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 5 comnds on list `queueComand`', async () => {
      let res = await run(motion, true);
      expect(queueComand.size()).to.be.equal(5);
    });

    it('shold put comand RUN on list `queueComand`', async () => {
      let res = await run(motion, true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA7);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAA);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAA);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAA);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA9);
      queueComand.dequeue();
    });
  });

  describe('Read Position', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xAA +  0x00 + 0xC8))&0xFF;
      arr = [0x3E, 0xAA , 0x00, 0x00, 0xC8, CS];
      queueResponseEncoderX.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0x01 + 0x0B + 0xB8))&0xFF;
      arr = [0x3E, 0xAA , 0x01, 0x0B, 0xB8, CS];
      queueResponseEncoderY.enqueue(arr);

      CS = (0x00 -(0x3E + 0xAA +  0xC02 +  0x0F + 0xA0))&0xFF;
      arr = [0x3E, 0xAA , 0x02, 0x0F, 0xA0, CS];
      queueResponseEncoderZ.enqueue(arr);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await readPosition(true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 3 comands on list `queueComand`', async () => {
      let res = await readPosition(true);
      expect(queueComand.size()).to.be.equal(3);
    });

    it('shold put the comand READ_POS on list `queueComand`', async () => {
      let res = await readPosition(true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAA);
      expect(CMD[2]).to.be.equal(0x00);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAA);
      expect(CMD[2]).to.be.equal(0x01);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAA);
      expect(CMD[2]).to.be.equal(0x02);
      queueComand.dequeue();
    });

    it('shold return a vector with the positions in step', async () => {
      let res = await readPosition(true);
      expect(res[0]).to.be.equal(200);
      expect(res[1]).to.be.equal(3000);
      expect(res[2]).to.be.equal(4000);
    });
  });

  describe('Axes Free', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();
      queueResponse.clear();

      CS = (0x00 -(0x3E + 0xAB +  0xC0 + 0x0A))&0xFF;
      arr = [0x3E, 0xAB , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await axesFree(false, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 1 comnds on list `queueComand`', async () => {
      let res = await axesFree(false, true);
      expect(queueComand.size()).to.be.equal(1);
    });

    it('shold return true', async () => {
      let res = await axesFree(false, true);
      expect(res).to.be.equal(true);
    });

    it('shold put comand AXES_FREE on list `queueComand`', async () => {
      let res = await axesFree('true', true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xAB);
      expect(CMD[2]).to.be.equal(0x01);
      queueComand.dequeue();
    });
  });

  describe('Ack', () => {
    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();
      queueResponseAck.clear();

      CS = (0x00 -(0x3E + 0xA9 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA9 , 0xC0, 0x00, 0x0A, CS];
      queueResponseAck.enqueue(arr);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await ack(true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 1 comnds on list `queueComand`', async () => {
      let res = await ack(true);
      expect(queueComand.size()).to.be.equal(1);
    });

    it('shold return status', async () => {
      let res = await ack(true);
      expect(res).to.be.equal(0x00);
    });

    it('shold put comand ACK on list `queueComand`', async () => {
      let res = await ack(true);
      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA9);
      expect(CMD[2]).to.be.equal(0x00);
      queueComand.dequeue();
    });
  });

  describe('Execute ', () => {
    let CS;
    let arr;
    let comand;

    beforeEach(() => {
      queueComand.clear();
      queueResponse.clear();
      comand = {"mover":"INICIO"};

      CS = (0x00 -(0x3E + 0xA2 +  0xC0 + 0x0A))&0xFF;
      arr = [0x3E, 0xA2 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);
      queueResponse.enqueue(arr);
      queueResponse.enqueue(arr);
      queueResponse.enqueue(arr);
      queueResponse.enqueue(arr);
      queueResponse.enqueue(arr);
      queueResponse.enqueue(arr);
    });

    it('shold return true', async () => {
      let res = await execute(comand, true);
      expect(res).to.be.equal(true);
    });

    it('shold put comnds on list `queueComand`', async () => {
      let res = await execute(comand, true);
      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 1 comnds on list `queueComand`', async () => {
      let res = await execute(comand, true);
      expect(queueComand.size()).to.be.equal(1);
    });

    it('shold put comand GOHOME on list `queueComand`', async () => {
      let res = await execute(comand, true);
      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA2);
      expect(CMD[2]).to.be.equal(0x50);
      expect(CMD[3]).to.be.equal(0x00);
      queueComand.dequeue();
    });

    it('shold put 7 comands DIR,MM,RUN on list `queueComand`', async () => {
      comand = {"mover":{"x": 300, "y": 2, "z": 1}};
      let res = await execute(comand, true);
      expect(queueComand.size()).to.be.equal(7);

      // let CMD = queueComand.peek();
      // expect(CMD[1]).to.be.equal(0xA2);
      // // expect(CMD[2]).to.be.equal(0x50);
      // // expect(CMD[3]).to.be.equal(0x00);
      // queueComand.dequeue();
    });
  });

  describe('UpdateGains', () => {

    let CS;
    let arr;

    beforeEach(() => {
      queueComand.clear();

      CS = (0x00 -(0x3E + 0xA3 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA3 , 0xC0, 0x00, 0x0A, CS];
      var i;
      for (i = 0; i < 3; i++) {
        queueResponse.enqueue(arr);
      }

      CS = (0x00 -(0x3E + 0xA5 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA5 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA3 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA3 , 0xC0, 0x00, 0x0A, CS];
      for (i = 0; i < 3; i++) {
        queueResponse.enqueue(arr);
      }

      CS = (0x00 -(0x3E + 0xA5 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA5 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);

      CS = (0x00 -(0x3E + 0xA3 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA3 , 0xC0, 0x00, 0x0A, CS];
      for (i = 0; i < 3; i++) {
        queueResponse.enqueue(arr);
      }

      CS = (0x00 -(0x3E + 0xA5 +  0xC0 + 0x00 + 0x0A))&0xFF;
      arr = [0x3E, 0xA5 , 0xC0, 0x00, 0x0A, CS];
      queueResponse.enqueue(arr);


    });

    it('shold put comands on list `queueComand`', async () => {
      let gains = {"motor": "x", "kp": 50, "kd" : 40, "ki": 1};
      let res = await updateGains(gains, true);

      expect(queueComand.isEmpty()).to.be.equal(false);
    });

    it('shold put 4 comands on list `queueComand`', async () => {
      let gains = {"motor": "y", "kp": 100, "kd" : 70, "ki": 1};
      let res = await updateGains(gains, true);

      expect(queueComand.size()).to.be.equal(4);
    });

    it('shold put comand `set_param` on list `queueComand`', async () => {
      let gains = {"motor": "x", "kp": 50, "kd" : 40, "ki": 1};
      let res = await updateGains(gains, true);

      let CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(39);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(50);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(40);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(40);
      queueComand.dequeue();


      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(41);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(1);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA5);
      expect(CMD[2]).to.be.equal(0);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(0);
      queueComand.dequeue();

      gains = {"motor": "y", "kp": 100, "kd" : 70, "ki": 1};
      res = await updateGains(gains);

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(42);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(100);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(43);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(70);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(44);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(1);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA5);
      expect(CMD[2]).to.be.equal(0);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(0);
      queueComand.dequeue();

      gains = {"motor": "z", "kp": 70, "kd" : 30, "ki": 1};
      res = await updateGains(gains);

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(45);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(70);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(46);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(30);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA3);
      expect(CMD[2]).to.be.equal(47);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(1);
      queueComand.dequeue();

      CMD = queueComand.peek();
      expect(CMD[1]).to.be.equal(0xA5);
      expect(CMD[2]).to.be.equal(0);
      expect(CMD[3]).to.be.equal(0);
      expect(CMD[4]).to.be.equal(0);
      queueComand.dequeue();
    });

  });

});
