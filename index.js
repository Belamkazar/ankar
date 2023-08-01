const puppeteer = require('puppeteer');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const puppeteerOptions = {
  args: ['--no-sandbox'],
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: puppeteerOptions,
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Conexión exitosa nenes');
});

// Función para manejar los mensajes entrantes
client.on('message', async message => {
  if (message.body === 'hola') {
    await message.reply('Hola papi');
  }
});

// Función para inicializar el cliente y navegar a WhatsApp Web con opciones de espera
async function initializeClient() {
  const browser = await puppeteer.launch(puppeteerOptions);
  await client.initialize(browser);

  // Obtener la página del cliente utilizando 'getPage()'
  const page = await client.getPage();

  // Navegar a WhatsApp Web en la página obtenida
  await page.goto('https://web.whatsapp.com/', {
    waitUntil: 'domcontentloaded', // Esperar a que el DOM esté completamente cargado
  });
}

// Inicializar el cliente
(async () => {
  await initializeClient();
})();
