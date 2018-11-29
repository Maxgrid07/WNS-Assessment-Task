'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  createdAt: Date,
  updatedAt: Date, 
  salt: String,
  hashedPassword: String,
  provider:String
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

/**
 * Validations
 */

// Validate Email if already exist
/**/
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    if(!value){
      delete self.email;
      respond(true);
    }
    this.constructor.findOne({email: value, deleted:false}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email is already in use.');

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64,'SHA1').toString('base64');
  }
};
var User = mongoose.model('User', UserSchema);
module.exports = User;
