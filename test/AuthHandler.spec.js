var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('request');
const httpMocks = require("node-mocks-http");
var HttpStatus = require('http-status-codes');
var oUserDAO = require('../daos/UserDAO');


describe('Signup user', function() {
    beforeEach(function() {
        this.addUser = sinon.stub(oUserDAO, 'addUser');
    });

    afterEach(function() {
        this.addUser.restore();
    });
    it('Should signup user successfully', function() {
        this.addUser.withArgs(sinon.match.any).returns({
            success: true,
            code: 200
        });

        const oRequest = httpMocks.createRequest({
            method: "POST",
            url: "/api/signup",
            body: {
                name: 'bao',
                email: 'test@gmail.com',
                password: '12345'
            }
        });
        const mockResponse = httpMocks.createResponse();
        var oauthHandler = require("../handlers/AuthHandler");
        oauthHandler.signup(oRequest, mockResponse);
        expect(mockResponse.statusCode, 200);

    });
    it('Should signup user failed', function() {
        this.addUser.withArgs(sinon.match.any).returns({
            success: false,
            code: 500
        });

        const oRequest = httpMocks.createRequest({
            method: "POST",
            url: "/api/signup",
            body: {
                name: 'bao',
                email: 'test@gmail.com',
                password: '12345'
            }
        });
        const mockResponse = httpMocks.createResponse();
        var oauthHandler = require("../handlers/AuthHandler");
        oauthHandler.signup(oRequest, mockResponse);
        expect(mockResponse.statusCode, 500);

    });
});