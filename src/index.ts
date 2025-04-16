import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir página HTML simulada
app.use(express.static(path.join(__dirname, 'public')));

// Usar as rotas da API
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
