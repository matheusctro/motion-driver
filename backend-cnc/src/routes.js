import express from 'express'

const MotionController = require('./controllers/motion');
const ComandsController = require('./controllers/comands');
const routes = express.Router();

routes.get('/motion', MotionController.index);
routes.get('/motions', MotionController.read);
routes.post('/motion', MotionController.store);
routes.post('/motions', MotionController.download);
routes.post('/clear', MotionController.clear);
routes.delete('/motion', MotionController.delete);

routes.post('/run', ComandsController.run);
routes.post('/stop', ComandsController.stop);
routes.post('/home', ComandsController.home);
routes.post('/position', ComandsController.position);
routes.post('/calibration', ComandsController.calibration);
routes.post('/free-axis', ComandsController.freeAxis);
routes.post('/execute', ComandsController.execute);
routes.post('/update-gains', ComandsController.updateGain);
routes.get('/read-gains', ComandsController.readGain);

export default routes
