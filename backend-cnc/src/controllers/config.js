import mongoose from 'mongoose';

const Motion = mongoose.model('motions');

module.exports = {
  async index(req, res) {
    let motions = [];
    let i;
    const motion = await Motion.find({});

    for (i = 0; i < motion.length; i += 1) {
      motions.push({
        '_id': posto[i]._id,
        'name': posto[i].Nome_modelo,
        'qtd_pontos': posto[i].Qtde_pontos,
        'pontos': posto[i].Motions,
      });
    }
    return res.json(motions);
  },

  async store(req, res) {

  },

  async config(req, res) {

  },

  async deletePosto(req, res) {

  },
};
