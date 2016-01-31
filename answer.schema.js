var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    value: {type: int},
    ip: { type: String},
    created_at    : { type: Date }
});


AnswerSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model("Answer", AnswerSchema);