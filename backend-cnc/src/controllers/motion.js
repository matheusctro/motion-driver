import mongoose from 'mongoose';
import Motion from '../models/motion';

import { write, read, clearMotion} from '../cnc/driver';
import {setAllow, readAllow} from '../comunications/serial/allow'
import queueComand from '../Queue/queueComand';
import queueResponse from '../Queue/queueResponse';
// const { io } = require('../socket.io').getio();

module.exports = {
  async index(req, res) {
    let motions = [];
    let i;

    const motionFind = await Motion.find({});

    for (i = 0; i < motionFind.length; i += 1) {
      motions.push({
        'id': motionFind[i].id,
        'name': motionFind[i].name,
        'qtd_cmmds': motionFind[i].qtd_cmmds,
        'cmmds': motionFind[i].cmmds,
      });
    }
    // const prog = await read(1);
    // console.log(prog);

    return res.json(motions);
  },
  async store(req, res) {
    const motion = req.body;

    const motionExists = await Motion.findOne({ id: motion.id });
    let response;

    if(motionExists){
      motionExists.id = motion.id;
      motionExists.name = motion.name;
      motionExists.qtd_cmmds = motion.qtd_cmmds;
      motionExists.cmmds = motion.cmmds;
      await motionExists.save();
      response = res.json({"status": "ok"});
    }else{
      const newMotion = await Motion.create({
        id: motion.id,
        name: motion.name,
        qtd_cmmds: motion.qtd_cmmds,
        cmmds: motion.cmmds,
      });
      response = res.json({"status": "ok"});
    }

    if(!readAllow()){
      queueComand.clear();
      queueResponse.clear();
    }

    setAllow(false);
    queueResponse.clear();
    await write(motion);
    let prog = await read(motion.id);

    if(motion.id == prog.id && motion.qtd_cmmds == prog.qtd_cmmds && motion.cmmds.length == prog.cmmds.length){
      console.log("Escrita com sucesso!");
      io.emit('/status', "Escrita com sucesso");
    }else{
      console.log("Escrita sem sucesso!");
      // await write(motion);
      // prog = await read(motion.id);
      // if(motion.id == prog.id && motion.qtd_cmmds == prog.qtd_cmmds && motion.cmmds.length == prog.cmmds.length){
      //   console.log("Escrita com sucesso!");
      // }
    }
    setAllow(true);
    return response;
  },
  async clear(req, res) {
    const motion = req.query;

    const motionExists = await Motion.findOne({ id: motion.id });
    let response;

    if(motionExists){
      motionExists.id = motion.id;
      motionExists.qtd_cmmds = 0;
      motionExists.cmmds = [];
      await motionExists.save();
      response = res.json({"status": "ok"});
    }else{
      console.log('Motion não existe');
      response = res.status(400).json({ "error": "Motion not exists" });
    }

    if(!readAllow()){
      queueComand.clear();
      queueResponse.clear();
    }

    setAllow(false);
    let resp = await clearMotion(Number(motion.id));

    if(resp){
      console.log("Motion limpo!");
      let prog = await read(Number(motion.id));

      if(motion.id == prog.id && prog.qtd_cmmds == 0 && prog.cmmds.length == 0){
        console.log("Verificado com sucesso!");
      }else{
        console.log("Falha na limpeza do Motion!");
      }
    }else{
      console.log("Falha na limpeza do Motion!")
    }
    setAllow(true);
    return response;
  },

  async delete(req, res) {
    const deleteMotion = req.query;
    const motionDeletado = await Motion.findOne({ id: deleteMotion.id });

    let response;

    if (motionDeletado) {
      await Motion.findOneAndDelete({ id: deleteMotion.id });
      response = res.json({"status": "ok"});
    } else {
      console.log('Motion não existe');
      response = res.status(400).json({ "error": "Motion not exists" });
    }
    return response;
  }
}
