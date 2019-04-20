var expect = require('chai').expect; 
var HttpStatus = require('http-status-codes');
 
describe('Utils module', function() {
    it('Should generate OTP', function(done) { 
        var oBody = JSON.stringify({ result: "OK" });
        var oUtils = require("../utils/Utils");
        let result = oUtils.generateOTP('test@gmail.com', Date.now(), 'admin');
        expect(result.length>0).equal(true);
        done();
    });
});