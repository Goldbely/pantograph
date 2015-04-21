'use strict';

var env, fs, stream, util;

env    = require('../../node_modules/image-resizer/src/config/environment_vars');
fs     = require('fs');
stream = require('stream');
util   = require('util');


function Local(image){
  /* jshint validthis:true */
  if (!(this instanceof Local)){
    return new Local(image);
  }
  stream.Readable.call(this, { objectMode : true });
  this.image = image;
  this.path = image.path.replace(/^elocal/i,'');
  this.filePath = env.LOCAL_FILE_PATH + '/' + this.path;
  this.ended = false;
  this.readAttemptCount = 0;
}

util.inherits(Local, stream.Readable);


Local.prototype._read = function(){
  var _this = this;
  if ( this.ended ){ return; }

  this.readAttemptCount += 1;

  // pass through if there is an error on the image object
  if (this.image.isError()){
    this.ended = true;
    this.push(this.image);
    return this.push(null);
  }

  this.image.log.time('local filesystem');

  fs.readFile(_this.filePath, function(err, data){
    _this.image.log.timeEnd('local filesystem');

    // if there is an error store it on the image object and pass it along
    if (err) {
      // if this is our second loop, accept defeat and error out
      if (_this.readAttemptCount > 1) {
        _this.image.error = new Error(err);
      }
      else {
        _this.filePath = env.LOCAL_FILE_PATH + '/' + env.IMAGE_404;
        _this._read();
        return;
      }
    }

    // if not store the image buffer
    else {
      _this.image.contents = data;
      _this.image.originalContentLength = data.length;
    }

    _this.ended = true;
    _this.push(_this.image);
    _this.push(null);
  });
};


module.exports = Local;
