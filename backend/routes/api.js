const express = require('express');
const router = express.Router();
const external_api_controller = require('../external_api_controller');
const ml_api_controller = require('../ml/ml_controller');

router.post('/test-ml', ml_api_controller.sendMLRequest);
router.post('/start-sim', external_api_controller.startSimulation);
router.post('/end-sim', external_api_controller.endSimulation);
router.post('/start-round', external_api_controller.startRound);


module.exports = router;