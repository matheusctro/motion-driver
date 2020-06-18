import mongoose from 'mongoose';
import Gains from '../models/gains';

import { calibration, goHome, stop, run, setSize, readPosition, ack, axesFree , execute, updateGains } from '../cnc/driver';
import {setAllow, readAllow} from '../comunications/serial/allow'

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = {
  async run(req, res) {
    setAllow(false);
    const runParam = req.query;
    let response;

    let i = 0;
    for(i = 0; i < Number(runParam.repetition); i++){
      response = await run(Number(runParam.id));
      if(i == 0){
        if (response)
        res.json({ "status": "ok" });
      else
        res.status(400).json({ "error": "Can't RUN" });
      }
    }
    setAllow(true);
    return;
  },

  async stop(req, res) {
    setAllow(false);
    let response = await stop();
    // console.log(response);

    setAllow(true);
    if(response)
      return res.json({"status": "ok"});
    else
      return res.status(400).json({ "error": "Can't stop" });
  },

  async home(req, res) {
    setAllow(false);
    let response = await goHome();
    // console.log(response);
    setAllow(true);
    if(response)
      return res.json({"status": "ok"});
    else
      return res.status(400).json({ "error": "Can't go to home" });
  },

  async position(req, res) {
    setAllow(false);
    let response = await readPosition();
    console.log(response);
    setAllow(true);
    if(!response)
      return res.status(400).json({ "error": "Can't read position" });

    return res.json(response);
  },

  async calibration(req, res) {
    const Param = req.query;
    setAllow(false);
    let response = await setSize(Param.sizeX, Param.sizeY, Param.sizeZ);
    response = await calibration();
    setAllow(true);

    if(response){
      io.emit('/status', "Calibrado com sucesso!");
      return res.json({"status": "ok"});
    }else
      return res.status(400).json({ "error": "Can't stop" });
  },

  async freeAxis(req, res) {
    const param = req.query;
    let response = await axesFree(param.value);
    if (response)
      return res.json({ "status": "ok" });
    else
      return res.status(400).json({ "error": "Can't free the axis" });
  },

  async execute(req,res){
    const param = req.body;
    let response = await execute(param);

    if (response)
      return res.json({ "status": "ok" });
    else
    return res.status(400).json({ "error": "Can't move!" });
  },

  async updateGain(req, res) {
    const gains = req.body;

    const gainExists = await Gains.findOne({ motor: gains.motor });

    if(gainExists){
      gainExists.motor = gains.motor;
      gainExists.kp = gains.kp;
      gainExists.kd = gains.kd;
      gainExists.ki = gains.ki;
      await gainExists.save();
    }else{
      const newGain = await Gains.create({
        motor: gains.motor,
        kp: gains.kp,
        kd: gains.kd,
        ki: gains.ki,
      });
    }

    setAllow(false);
    let response = await updateGains(gains);
    setAllow(true);

    if(response){
      io.emit('/status', "Update realizado com sucesso!");
      return res.json({"status": "ok"});
    }else{
      io.emit('/status', "Updade não pode ser realizado!");
      return res.status(400).json({ "error": "Updade não pode ser realizado" });
    }
  },

  async readGain(req, res) {
    let gains = [];
    let flagGains = [false, false, false];
    let i;

    const gainFind = await Gains.find({});

    for (i = 0; i < gainFind.length; i += 1) {
      gains.push({
        'motor': gainFind[i].motor,
        'kp': gainFind[i].kp,
        'kd': gainFind[i].kd,
        'ki': gainFind[i].ki
      });

      if (gainFind[i].motor == 'x') flagGains[0] = true;

      if (gainFind[i].motor == 'y') flagGains[1] = true;

      if (gainFind[i].motor == 'z') flagGains[2] = true;
    }

    if (!flagGains[0]) gains.push({ 'motor': 'x', 'kp': 0, 'kd': 0, 'ki': 0 });

    if (!flagGains[1]) gains.push({ 'motor': 'y', 'kp': 0, 'kd': 0, 'ki': 0 });

    if (!flagGains[2]) gains.push({ 'motor': 'z', 'kp': 0, 'kd': 0, 'ki': 0 });

    return res.json(gains);
  }

}
