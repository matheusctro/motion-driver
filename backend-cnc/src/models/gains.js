const { Schema, model } = require('mongoose');

const motionSchema = new Schema({
  motor:{
    type: String,
    required: true,
  },
  kp: {
    type: Number,
    required: true,
  },
  kd: {
    type: Number,
    required: true,
  },
  ki: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('gains', motionSchema);