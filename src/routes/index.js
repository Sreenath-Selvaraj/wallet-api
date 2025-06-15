const glob = require('glob');
const path = require('path');

function initRoutes(app) {

  glob.sync(`${__dirname}/**/*.route.js`).forEach((file) => {
    const route = require(path.resolve(file));
    app.use('', route);
  });
}

module.exports = {
  initRoutes
};
