'use strict';

if (process.env.NEW_RELIC_LICENSE_KEY){
  require('newrelic');
}

var express, rollbar, app, ir, env, Img, streams;

express = require('express');
rollbar = require('rollbar');
app     = express();
ir      = require('image-resizer');
env     = ir.env;
Img     = ir.img;
streams = ir.streams;

if (env.development) {
  var exec = require('child_process').exec;
  var chalk = require('chalk');

  // check to see if vips is installed
  exec ('vips --version', function (err, stdout, stderr) {
    if (err || stderr) {
      console.error(
        chalk.red('\nMissing dependency:'),
        chalk.red.bold('libvips')
      );
      console.log(
        chalk.cyan('  to install vips on your system run:'),
        chalk.bold('./node_modules/image_resizer/node_modules/sharp/preinstall.sh\n')
      );
    }
  });
}

app.disable('x-powered-by');


app.directory = __dirname;
ir.expressConfig(app);

app.get('/favicon.ico', function (request, response) {
  response.sendStatus(404);
});

app.get('/robots.txt', function (request, response) {
  response.sendStatus(404);
});

/**
Return the modifiers map as a documentation endpoint
*/
app.get('/modifiers.json', function(request, response){
  response.json(ir.modifiers);
});


/**
Some helper endpoints when in development
*/
if (env.development){
  // Show a test page of the image options
  app.get('/test-page', function(request, response){
    response.render('index.html');
  });

  // Show the environment variables and their current values
  app.get('/env', function(request, response){
    response.json(env);
  });
}


/*
Return an image modified to the requested parameters
  - request format:
    /:modifers/path/to/image.format:metadata
    eg: https://my.cdn.com/s50/sample/test.png
*/
app.get('/*?', function(request, response){
  var image = new Img(request);

  response.header('X-Powered-By', 'Food from Goldbely');

  image.getFile()
    .pipe(new streams.identify())
    .pipe(new streams.resize())
    .pipe(new streams.filter())
    .pipe(new streams.optimize())
    .pipe(streams.response(request, response));
});

// Use the rollbar error handler to send exceptions to your rollbar account
if(process.env.ROLLBAR_POST_CLIENT_ITEM_ACCESS_TOKEN) {
  app.use(rollbar.errorHandler(process.env.ROLLBAR_POST_CLIENT_ITEM_ACCESS_TOKEN));
  rollbar.handleUncaughtExceptions(process.env.ROLLBAR_POST_CLIENT_ITEM_ACCESS_TOKEN, {});
}

/**
Start the app on the listed port
*/
app.listen(app.get('port'));
