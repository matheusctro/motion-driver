import mongoose from 'mongoose';

const motionSchema = new mongoose.Schema({
  Nome_modelo: {
    type: String,
    required: true,
  },
  Qtde_pontos: {
    type: Number,
    required: true,
  },
  Motions: {
    type: [{
      Tempo: {
        type: Number,
        required: true,
      },
      Ponto: {
        type: [Number],
        required: true,
      }
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('motions', motionSchema);
