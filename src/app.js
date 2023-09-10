const express = require('express');
const bodyParser = require('body-parser');
const paymentRouter = require('./router/payment.router');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/payment-form', (req, res) => {
  // Render the HTML form (you can use a template engine like EJS)
  res.sendFile(__dirname + '/public/payment-form.html');
});
app.post('/process-payment', paymentRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app