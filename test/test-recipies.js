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

  it('should add recipe on POST', function() {
    const newRecipe = {name: 'pizza', ingredients: ['sauce', 'dough', 'cheese']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('name', 'ingredients');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
      });
  });

  it('should update recipie on PUT', function () {
    const updated = {name: 'fried rice', ingredients: ['rice', 'fried stuff']};
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updated.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updated.id}`)
          .send(updated);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updated);
      });
  });
  it('should delete recipe on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});