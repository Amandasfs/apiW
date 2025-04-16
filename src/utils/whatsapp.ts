import { create, Whatsapp } from 'venom-bot';
import axios from 'axios';

let client: Whatsapp | null = null;

// Objeto para armazenar o estado da conversa de cada cliente
const conversas: Record<string, any> = {};

// Cria o cliente Venom e configura os eventos
const createClient = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando cliente Venom...');

    client = await create(
      'floresnet-session',
      (base64Qr, asciiQR, attempts, urlCode) => {
        console.log('\n📲 Escaneie o QR Code abaixo no WhatsApp Web:');
        console.log(asciiQR);
      },
      undefined,
      {
        headless: false,
        disableWelcome: true,
      }
    );

    client.onStateChange((state) => {
      console.log('📟 Estado do cliente:', state);
    });

    client.onMessage(async (message) => {
      if (!message.isGroupMsg && client) {
        const nome = message.sender?.pushname || 'cliente';
        const numero = message.from;
        const msg = message.body?.trim().toLowerCase();

        console.log(`💬 Mensagem recebida de ${nome} (${numero}): ${message.body}`);
        
        // Verifica o estado da conversa
        const estado = conversas[numero] ? conversas[numero].estado : null;

        // Mensagem inicial
        if (msg.includes('oi') || msg.includes('olá') || msg.includes('bom dia')) {
          await client.sendText(numero, `Olá ${nome}! 👋 Seja bem-vindo à Floresnet 🌸\nComo posso te ajudar hoje?\n\nDigite:\n1️⃣ Para ver opções de flores\n2️⃣ Falar com um atendente`);
          conversas[numero] = { estado: 'inicial' };
        }
        
        // Verifica se o cliente quer ver opções de flores
        if (estado === 'inicial' && msg === '1') {
          await client.sendText(numero, '🌸 Temos:\n- 🌹 Rosas\n- 🌷 Tulipas\n- 🌻 Girassóis\n\nDigite o nome da flor para adicionar ao carrinho.');
          conversas[numero] = { estado: 'aguardando_flower' };
        }

        // Cliente escolhe a flor
        else if (estado === 'aguardando_flower' && (msg === 'rosas' || msg === 'tulipas' || msg === 'girassóis')) {
          conversas[numero] = { estado: 'aguardando_quantidade', flor: msg };
          await client.sendText(numero, `Você escolheu ${msg}! Quantas flores deseja?\n1️⃣ 10 flores\n2️⃣ 20 flores\n3️⃣ Outro número`);
        }

        // Cliente responde com a quantidade
        else if (estado === 'aguardando_quantidade') {
          const quantidade = parseInt(msg, 10);
          if (isNaN(quantidade) || quantidade <= 0) {
            await client.sendText(numero, 'Por favor, escolha uma quantidade válida: 10, 20 ou outro número.');
            return;
          }

          // Armazenar a flor e quantidade no carrinho
          if (!conversas[numero].carrinho) conversas[numero].carrinho = [];
          conversas[numero].carrinho.push({ flor: conversas[numero].flor, quantidade });

          await client.sendText(numero, `${quantidade} ${conversas[numero].flor} adicionados ao seu carrinho. Deseja adicionar mais produtos? Ou digite "finalizar compra" para concluir.`);
          conversas[numero] = { estado: 'aguardando_confirmacao', carrinho: conversas[numero].carrinho };
        }

        // Finalizar compra
        else if (estado === 'aguardando_confirmacao' && msg === 'finalizar compra') {
          const produtos = conversas[numero].carrinho;
          const cartLink = generateCartLink(produtos);
          await client.sendText(numero, `Aqui está seu carrinho: ${cartLink}\nObrigado pela sua compra! 🌸`);
          delete conversas[numero]; // Limpar estado após a compra
        }

        // Se o cliente deseja adicionar outro produto
        else if (estado === 'aguardando_confirmacao' && msg !== 'finalizar compra') {
          conversas[numero].estado = 'aguardando_flower';
          await client.sendText(numero, 'Digite o nome da próxima flor ou digite "finalizar compra" para concluir.');
        }

        // Caso não entenda a mensagem
        else {
          await client.sendText(numero, `Desculpe ${nome}, não entendi. 🤔\nEnvie "1" para ver opções ou "2" para atendimento.`);
        }
      }
    });    

    console.log('✅ Cliente Venom iniciado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao iniciar o cliente:', error);
  }
};

// Função para gerar o link do carrinho
const generateCartLink = (produtos: any[]) => {
  const produtosString = produtos.map(p => `${p.quantidade} de ${p.flor}`).join(", ");
  return `https://Amandasfs.github.io/apiW/carrinho.html?produtos=${encodeURIComponent(produtosString)}`;
};

// Função para enviar a mensagem para o WhatsApp
const sendMessage = async (to: string, message: string): Promise<void> => {
  if (!client) {
    await createClient();
  }

  if (client) {
    try {
      await client.sendText(to, message);
      console.log(`✅ Mensagem enviada para ${to}: ${message}`);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
    }
  } else {
    console.error('❌ Cliente não inicializado.');
  }
};

// Inicia o cliente automaticamente ao rodar o script
createClient();

export { createClient, sendMessage };
