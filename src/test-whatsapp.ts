import { create } from 'venom-bot';

create(
  'floresnet-session',
  (base64Qr, asciiQR) => {
    console.log('\n📲 Escaneie o QR Code abaixo:');
    console.log(asciiQR); // Aqui deve aparecer o QR no terminal
  },
  (status) => {
    console.log('📡 Status:', status);
  },
  {
    headless: false,
    disableWelcome: true,
  }
).then((client) => {
  console.log('✅ Cliente Venom conectado!');
  client.onMessage((message) => {
    console.log('📩 Nova mensagem:', message);
  });
}).catch((error) => {
  console.error('❌ Erro ao iniciar cliente:', error);
});
