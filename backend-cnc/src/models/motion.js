const { Schema, model } = require('mongoose');

const motionSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  qtd_cmmds: {
    type: Number,
    required: true,
  },
  cmmds: {
    type: Array,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('motions', motionSchema);

