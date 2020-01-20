async function index(req, res) {
  let postos = [];
  let i;
  const posto = await Posto.find({});

  for (i = 0; i < posto.length; i += 1) {
    postos.push({
      '_id': posto[i]._id,
      'name': posto[i].name,
      'type': posto[i].type,
      'trajetoria': posto[i].trajetoria,
    });
  }
  return res.json(postos);
}

async function store(req, res) {
  const newPosto = req.body;
  const postoExists = await Posto.findOne({ name: newPosto.name });

  if (postoExists) {
    console.log('já existe');
    return res.json(postoExists);
  }

  const posto = await Posto.create({
    name: newPosto.name,
    type: newPosto.type,
    trajetoria: newPosto.trajetoria,
  });

  return res.json(posto);
}

async function config(req, res) {
  const configPosto = req.body;
  const postoConfig = await Posto.findOne({ name: configPosto.name });
  let response;

  if (postoConfig) {
    postoConfig.type = configPosto.type;
    postoConfig.trajetoria = configPosto.trajetoria;
    await postoConfig.save();
    response = res.json(postoConfig);
  } else {
    console.log('Posto não existe');
    response = res.status(400).json({ error: 'Posto not exists' });
  }
  return response;
}

async function deletePosto(req, res) {
  const deletePosto = req.body;
  const postoDeletado = await Posto.findOne({ name: deletePosto.name });
  let response;

  if (postoDeletado) {
    await Posto.findOneAndDelete({ name: deletePosto.name });
    response = res.json(postoDeletado);
  } else {
    console.log('Posto não existe');
    response = res.status(400).json({ error: 'Posto not exists' });
  }
  return response;
}

