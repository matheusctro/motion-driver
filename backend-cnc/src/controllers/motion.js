import mongoose from 'mongoose';
import Motion from '../models/motion';

import { write, read, clearMotion} from '../cnc/driver';
import {setAllow, readAllow} from '../comunications/serial/allow'
import queueComand from '../Queue/queueComand';
import queueResponse from '../Queue/queueResponse';

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

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
      setAllow(false);
      sleep(1000);
    }

    setAllow(false);

    console.log(motion);

    await write(motion);
    let prog = await read(motion.id);

    if(motion.id == prog.id && motion.qtd_cmmds == prog.qtd_cmmds && motion.cmmds.length == prog.cmmds.length){
      console.log("Escrita com sucesso!");
      io.emit('/status', "Programa atualizado com sucesso!");
    }else{
      console.log(motion);
      console.log(prog);
      io.emit('/status', "Programa não pode ser atualizado!");
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

  async read(req, res){
    let motions = [];

    let i;
    for (i = 0; i < 64; i++) {
      const motion = await read(i);
      if(motion != false){
        if (motion.qtd_cmmds != 0) {
          console.log(motion);
          motions.push(motion);
          const motionExists = await Motion.findOne({ id: motion.id });
  
          if (motionExists) {
            motionExists.id = motion.id;
            motionExists.name = motion.name;
            motionExists.qtd_cmmds = motion.qtd_cmmds;
            motionExists.cmmds = motion.cmmds;
            await motionExists.save();
            console.log("Programa salvo");
  
          } else {
            const newMotion = await Motion.create({
              id: motion.id,
              name: motion.name,
              qtd_cmmds: motion.qtd_cmmds,
              cmmds: motion.cmmds,
            });
            console.log("Programa criado");
          }
        }
      }
    }
    console.log("Upload finalizado!");
    io.emit('/status', "Upload finalizado!");

    return res.json(motions);
  },

  async download(req, res) {
    const motions = req.body.motions;

    let response;
    response = res.json({"status": "ok"});

    if(!readAllow()){
      setAllow(false);
      sleep(1000);
    }

    setAllow(false);
    let respo = true;
    let i;

    for(i = 0; i < motions.length; i++){
      await write(motions[i]);
      let prog = await read(motions[i].id);

      if (motions[i].id == prog.id && motions[i].qtd_cmmds == prog.qtd_cmmds && motions[i].cmmds.length == prog.cmmds.length) {
        console.log("Escrita com sucesso!");
      } else {
        respo = false;
        console.log(motions[i]);
        console.log(prog);
        console.log("Escrita sem sucesso!");
      }
    }
    setAllow(true);

    if(respo){
      io.emit('/status', "Download finalizado com sucesso!");
    }else{
      io.emit('/status', "Download finalizado sem sucesso!");
    }

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
        io.emit('/status', "Programa atualizado com sucesso!");
      }else{
        console.log("Falha na limpeza do Motion!");
        io.emit('/status', "Programa não pode ser atualizado!");
      }
    }else{
      io.emit('/status', "Programa não pode ser atualizado!");
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
