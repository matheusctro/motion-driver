import { calibration, goHome, stop, run, setSize, readPosition, ack, axesFree , execute } from '../cnc/driver';

module.exports = {
  async run(req, res) {
    const runParam = req.query;
    let response;

    let i = 0;
    for(i = 0; i < Number(runParam.repetition); i++){
      response = await run(Number(runParam.id));
    }

    if (response)
      return res.json({ "status": "ok" });
    else
      return res.status(400).json({ "error": "Can't RUN" });
  },

  async stop(req, res) {
    let response = await stop();
    console.log(response);

    if(response)
      return res.json({"status": "ok"});
    else
      return res.status(400).json({ "error": "Can't stop" });
  },

  async home(req, res) {
    let response = await goHome();
    console.log(response);

    if(response)
      return res.json({"status": "ok"});
    else
      return res.status(400).json({ "error": "Can't go to home" });
  },

  async position(req, res) {

    let response = await readPosition();
    console.log(response);

    if(!response)
      return res.status(400).json({ "error": "Can't read position" });

    return res.json(response);
  },

  async calibration(req, res) {
    const Param = req.query;

    let response = await setSize(Param.sizeX, Param.sizeY, Param.sizeZ);

    response = await calibration();

    if(response)
      return res.json({"status": "ok"});
    else
      return res.status(400).json({ "error": "Can't stop" });
  },

  async freeAxis(req, res) {
    const param = req.query;
    let response = await axesFree(param.value);
    console.log(response);

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
      return res.status(400).json({ "error": "Can't execute step" });
  }
}
