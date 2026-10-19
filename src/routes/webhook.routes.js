const express = require('express');

const router = express.Router();

const webhookController = require('../controllers/webhook.controller');

router.post('/shipprime', webhookController.shipPrimeWebhook);
router.post('/cashfree', webhookController.cashfreeWebhook);

module.exports = router;
