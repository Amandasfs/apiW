import express from 'express';
import path from 'path';

const app = express();

// Serve arquivos estáticos da pasta 'src/public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o carrinho (caso queira acessar diretamente a página)
app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'carrinho.html'));
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
