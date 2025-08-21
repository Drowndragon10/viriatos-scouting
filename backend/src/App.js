const express = require('express');
const cors = require('cors');
const sequelize = require('./models/database');

require('./models/associations');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use((req, res) => {
  res.status(404).send({ message: 'Rota não encontrada!' });
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso!');
    app.listen(port, () => {
      console.log(`Servidor iniciado em http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar as tabelas:', err);
  });
