const paypal = require('paypal-rest-sdk');
const dotenv = require('dotenv');
dotenv.config();

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const createPaypalPayment = (paymentData) => {
  
  return new Promise((resolve, reject) => {   
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        reject(error);
      } else {
        resolve(payment);
      }
    });
  });
};

module.exports = {
  createPaypalPayment,
};
