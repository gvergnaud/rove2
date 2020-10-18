const express = require('express');
const next = require('next');
const Router = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
const server = express();
const handle = Router.getRequestHandler(app);

app.prepare().then(() => {
  server.get('*', handle);
  server.listen(3000);
});
