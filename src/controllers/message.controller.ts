import { Request, Response } from 'express';
import { getProductById } from '../services/product.service';
import { generateCartLink } from '../utils/generateCartLink';
import { sendMessage } from '../utils/whatsapp'; // Função para enviar mensagem para o WhatsApp

// Armazenar o estado da conversa
const conversationState: Record<string, any> = {};
const carrinho: Record<string, any[]> = {};

export const handleMessage = async (req: Request, res: Response): Promise<void> => {
  const { message, from } = req.body; // 'from' vem do corpo da mensagem, é o número do WhatsApp

  // 1. Quando o cliente escolhe uma flor (ex: "rosa", "lírio", "tulipa")
  if (message.toLowerCase().includes("rosa") || message.toLowerCase().includes("lírio") || message.toLowerCase().includes("tulipa")) {
    conversationState[from] = { step: "aguardando_quantidade", produto: message.toLowerCase() };
    await sendMessage(from, `Você escolheu um buquê de ${message}. Quantas flores deseja?\n1️⃣ 10 flores\n2️⃣ 20 flores\n3️⃣ Outro número?`);
    res.json({ message: 'Aguardando a quantidade de flores' });
    return;
  }

  // 2. Quando o cliente responde com a quantidade (10, 20 ou outro número)
  if (conversationState[from]?.step === "aguardando_quantidade") {
    const quantidade = parseInt(message, 10);

    if (isNaN(quantidade)) {
      await sendMessage(from, 'Por favor, escolha uma quantidade válida: 10, 20 ou outro número.');
      res.json({ message: 'Quantidade inválida' });
      return;
    }

    const produto = conversationState[from].produto;
    carrinho[from] = carrinho[from] || [];
    carrinho[from].push({ produto, quantidade });

    await sendMessage(from, `Adicionamos ${quantidade} de ${produto} ao seu carrinho.\nDeseja adicionar mais algum produto? Ou digite "finalizar compra" para concluir.`);
    conversationState[from] = { step: "aguardando_produto_ou_finalizar" };
    res.json({ message: 'Produto adicionado ao carrinho' });
    return;
  }

  // 3. Quando o cliente diz "finalizar compra"
  if (message.toLowerCase() === "finalizar compra") {
    const produtos = carrinho[from] || [];
    const cartLink = generateCartLink(produtos);
    const replyMessage = `Aqui está seu carrinho: ${cartLink}`;

    await sendMessage(from, replyMessage);

    // Limpa o estado após finalizar a compra
    conversationState[from] = null;
    carrinho[from] = [];
    res.json({ message: 'Compra finalizada', cartLink });
    return;
  }

  // 4. Quando o cliente deseja adicionar outro produto
  if (conversationState[from]?.step === "aguardando_produto_ou_finalizar" && message.toLowerCase() !== "finalizar compra") {
    await sendMessage(from, `Adicionamos o produto ${message} ao seu carrinho.\nDeseja adicionar mais algum produto? Ou digite "finalizar compra" para concluir.`);
    carrinho[from].push({ produto: message });
    res.json({ message: 'Produto adicionado ao carrinho' });
    return;
  }

  // Caso o cliente envie algo fora do esperado
  await sendMessage(from, 'Desculpe, não entendi. Tente novamente.');
  res.status(400).json({ message: 'Mensagem não entendida' });
};
