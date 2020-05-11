import { calibration, goHome, stop, run, setSize, readPosition, ack, axesFree , execute } from '../cnc/driver';
import {setAllow} from '../comunications/serial/allow'

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
    if(response)
      return res.json({"status": "ok"});
    else
      return res.status(400).json({ "error": "Can't stop" });
  },

  async freeAxis(req, res) {
    setAllow(false);
    const param = req.query;
   // console.log(param);
    let response = await axesFree(param.value);
    // console.log(response);
    setAllow(true);
    if (response)
      return res.json({ "status": "ok" });
    else
      return res.status(400).json({ "error": "Can't free the axis" });
  },

  async execute(req,res){
    setAllow(false);
    const param = req.body;
    let response = await execute(param);

    setAllow(true);
    if (response)
      return res.json({ "status": "ok" });
    else
      return res.status(400).json({ "error": "Can't execute step" });
  }
}
