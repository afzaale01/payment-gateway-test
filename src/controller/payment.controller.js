const paypalService = require('../services/paypal.service');
const braintreeService = require('../services/braintree.service');
const mysqlService = require('../services/mysql.service');


  
const processPayment = async (req, res) => {
  const {
    amount,
    currency,
    fullName,
    cardholderName,
    cardNumber,
    expirationMonth,
    expirationYear,
    cvv,
  } = req.body;

  try {
    let paymentData = null;

    if ((currency === 'USD' || currency === 'EUR' || currency === 'AUD') || cardNumber.startsWith('3')) {
      // Use PayPal for USD, EUR, AUD, or AMEX
      paymentData = {
        intent: 'sale',
        payer: {
          payment_method: 'credit_card',
          funding_instruments: [
            {
              credit_card: {
                number: cardNumber,
                type: 'visa', // You can detect card type here
                expiration_month: expirationMonth,
                expiration_year: expirationYear,
                cvv: cvv,
                first_name: cardholderName,
              },
            },
          ],
        },
        transactions: [
          {
            amount: {
              total: amount,
              currency: currency,
            },
            description: 'Payment for ' + fullName,
          },
        ],
      };      

      const paypalPayment = await paypalService.createPaypalPayment(paymentData);
      const insertQuery = 'INSERT INTO orders (amount, currency, customer_name, payment_response) VALUES (?, ?, ?, ?)';
      const insertValues = [amount, currency, fullName, JSON.stringify(paypalPayment)];
      const [rows] = await mysqlService.executeQuery(insertQuery, insertValues);

      res.status(200).json({ message: 'Payment successful', orderId: rows.insertId });
    } else {


      // Use Braintree for other currencies
      paymentData = {
        amount: amount,
        paymentMethodNonce: 'fake-valid-nonce', // Replace with the actual nonce
      };

      const braintreePayment = await braintreeService.createBraintreePayment(paymentData);

      // Save the order and payment response to the database using the MySQL service
      const insertQuery = 'INSERT INTO orders (amount, currency, customer_name, payment_response) VALUES (?, ?, ?, ?)';
      const insertValues = [amount, currency, fullName, JSON.stringify(braintreePayment)];
      const [rows] = await mysqlService.executeQuery(insertQuery, insertValues);

      res.status(200).json({ message: 'Payment successful', orderId: rows.insertId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
};

module.exports = {
  processPayment,
};
