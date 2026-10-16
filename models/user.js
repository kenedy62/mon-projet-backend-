const mongoose = require('mongoose')
const myPlugin = require('mongoose-unique-validator').default;
const uniqueValidator = require('mongoose-unique-validator').default

const userSchema = mongoose.Schema({
  email:{type: String, require: true, unique: true},
  password : {type: String, require: true},
  whatsappNumber:{type: Number},
  facebookUrl: { type: String, default: "https://facebook.com" } 
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);