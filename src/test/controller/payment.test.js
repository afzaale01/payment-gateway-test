const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js'); // Import your Express app

chai.use(chaiHttp);
const expect = chai.expect;

describe('Payment Controller', () => {

  if(app.address == null)
  {
    console.log(app);
    console.log("Address is working");
  }



  it('should process a payment and return a success message', (done) => {
    const paymentData = {
      amount: '100',
      currency: 'USD',
      fullName: 'John Doe',
      cardholderName: 'John Doe',
      cardNumber: '4111111111111111',
      expirationMonth: '02',
      expirationYear: '2023',
      cvv: '111',
    };

    chai
      .request(app)
      .post('/process-payment')
      .send(paymentData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal('Payment successful');
        expect(res.body).to.have.property('orderId').to.be.a('number');
        done();
      });
  });
});
