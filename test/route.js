'use strict';

const Koa = require('koa');
const request = require('supertest');
const Route = require('../lib/route');
const assert = require('assert');

describe('Route', function() {
  let app;

  beforeEach(function() {
    app = new Koa();
  });

  it('construct without new', function() {
    Route('/').should.be.ok;
  });

  it('play with route', function(done) {
    const r = Route('/foo');

    app.use((ctx, next) => {
      return r.dispatch(ctx, next);
    });

    // r.stack.length = 0

    request(app.listen())
      .get('/foo')
      .expect(404, done);
  });

  it('one route', function(done) {
    const fn = (ctx) => {
      ctx.body = ctx.method;
    };

    const r = Route('/foo')
      .get(fn)
      .post(fn)
      .put(fn);

    app.use((ctx, next) => {
      return r.dispatch(ctx, next);
    });
    app = app.callback();
    
    request(app)
      .delete('/foo')
      .expect(404, done);
  });
});