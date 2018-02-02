'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('test recipes', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list recipes on GET', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.be.at.least(1);

      const expectedKeys = ['id', 'name', 'ingredients'];
      res.body.forEach(function(recipe) {
        expect(recipe).to.be.a('object');
        expect(recipe).to.include.keys(expectedKeys);
      });
    });
  });
});