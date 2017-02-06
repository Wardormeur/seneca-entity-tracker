'use strict';
var seneca = require('seneca')();
seneca.use('entity'); // Only for seneca > 2.0
seneca.use('basic'); // Only > 3.0
seneca.use('..', { entities: ['color'] });
var _lab = require('lab');
var lab = exports.lab = _lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = require('code').expect;

process.setMaxListeners(0);

describe('seneca-entity-tracker', function () {
  var ENTITY;
  var color;
  ENTITY = seneca.make$('color');
  color = { name: 'red' };

  it('should register a creation date', function (done) {
    ENTITY.save$(color, function (err, entity) {
      color = entity;
      expect(color.created_at).to.exist();
      done();
    });
  });
  it('should register an update date', function (done) {
    ENTITY.save$(color, function (err, entity) {
      expect(entity.updated_at).to.exist();
      done();
    });
  });
  it('should keep the same creation date', function (done) {
    ENTITY.save$(color, function (err, entity) {
      expect(entity.created_at).to.be.equal(color.created_at);
      done();
    });
  });
  it('should avoid overwriting created_at', function (done) {
    color.created_at = new Date();
    ENTITY.save$(color, function (err, entity) {
      expect(entity.created_at).to.not.be.equal(color.created_at);
      done();
    });
  });
  it('should still save other params', function (done) {
    color.r = 255;
    color.g = 255;
    color.b = 255;
    ENTITY.save$(color, function (err, entity) {
      expect(entity.r).to.be.equal(color.r);
      expect(entity.g).to.be.equal(color.g);
      expect(entity.b).to.be.equal(color.b);
      done();
    });
  });
  it('should soft delete', function (done) {
    ENTITY.remove$(color, function (err, entity) {
      expect(entity.deleted_at).to.exist();
      color = entity;
      done();
    });
  });
  it('should avoid being deleted twice and keep the originial deletion date', function (done) {
    ENTITY.remove$(color, function (err, entity) {
      expect(entity.deleted_at.toString()).to.be.equal(color.deleted_at.toString());
      done();
    });
  });
  it('should only work for defined entities', function (done) {
    var b_ENTITY = seneca.make$('bananas');
    var string = 'ImABANANA';
    b_ENTITY.save$({ name: string }, function (err, entity) {
      expect(entity.name).to.be.equal(string);
      expect(entity.created_at).to.not.exist();
      done();
    });
  });
});
