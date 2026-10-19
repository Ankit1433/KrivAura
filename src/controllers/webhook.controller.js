const webhookService = require('../services/webhook.service');
const paymentService = require('../services/payment.service');
const AppError = require('../utils/AppError');

const shipPrimeWebhook = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token !== `Bearer ${process.env.SHIPPRIME_WEBHOOK_SECRET}`) {
      throw new AppError('Unauthorized webhook', 401);
    }

    console.log('ShipPrime Webhook');
    console.log(JSON.stringify(req.body, null, 2));

    await webhookService.handleShipPrimeWebhook(req.body);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

const cashfreeWebhook = async (req, res, next) => {
  try {
    await paymentService.processCashfreeWebhook(
      req.body,
      req.headers,
      req.rawBody,
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  shipPrimeWebhook,
  cashfreeWebhook,
};
