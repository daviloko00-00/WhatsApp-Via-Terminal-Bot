// Importa a biblioteca principal do WhatsApp Web
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');

// Cria uma nova instância do cliente WhatsApp
const client = new Client();
let ultimoContato = null; // Armazena o último número que enviou mensagem

// Exibe o QR code no terminal para login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("📱 Escaneie o QR code acima com o WhatsApp");
});

// Quando estiver pronto, ativa o envio pelo terminal
client.on('ready', () => {
    console.log("✅ Cliente está pronto e conectado!");
    iniciarEntradaTerminal();
});

// Função para simular uma resposta com atraso aleatório
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Evento: quando uma mensagem nova chega
client.on('message', async msg => {
    const texto = msg.body.toLowerCase();
    ultimoContato = msg.from;

    console.log(`📩 Mensagem recebida de ${msg.from}: "${msg.body}"`);

    // Resposta para cumprimentos
    if (texto.includes("oi") || texto.includes("e aí") || texto.includes("fala") || texto.includes("salve") || texto.includes("bom dia") || texto.includes("boa tarde") || texto.includes("boa noite")) {
        const tempoEspera = Math.floor(Math.random() * 5000) + 5000;
        await delay(tempoEspera);
        msg.reply("Fala aí! Tudo certo? 😄");
    }

    // Resposta para "vai colar?"
    if (texto.includes("vai colar")) {
        const tempoEspera = Math.floor(Math.random() * 5000) + 5000;
        await delay(tempoEspera);
        msg.reply("Talvez... depende da vibe do rolê 😂");
    }
});

// Inicializa o cliente
client.initialize();

// --- Função de envio pelo terminal ---
function iniciarEntradaTerminal() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("\n💬 Comandos disponíveis:");
    console.log("numero:mensagem → Envia para um número específico (Ex: 5599999999999:Olá!)");
    console.log("responder:mensagem → Responde ao último contato que enviou mensagem");
    console.log("broadcast:Nome1,Nome2:mensagem → Envia mensagem para contatos selecionados pelo nome");
    console.log("sair → Fecha o programa\n");

    async function perguntar() {
        rl.question("> ", async (input) => {
            if (input.toLowerCase() === 'sair') {
                console.log("👋 Encerrando...");
                process.exit(0);
            }

            // 1️⃣ Enviar para um número específico
            if (input.includes(':') && !input.toLowerCase().startsWith('responder:') && !input.toLowerCase().startsWith('broadcast:')) {
                const partes = input.split(':');
                if (partes.length >= 2) {
                    const numero = partes[0].replace(/\D/g, '') + "@c.us";
                    const texto = partes.slice(1).join(':').trim();
                    try {
                        await client.sendMessage(numero, texto);
                        console.log(`✅ Mensagem enviada para ${partes[0]}`);
                    } catch (err) {
                        console.error("⚠️ Erro ao enviar:", err);
                    }
                }
            }

            // 2️⃣ Responder ao último contato
            else if (input.toLowerCase().startsWith('responder:')) {
                if (!ultimoContato) {
                    console.log("❌ Nenhum contato registrado ainda para responder.");
                } else {
                    const texto = input.split(':').slice(1).join(':').trim();
                    try {
                        await client.sendMessage(ultimoContato, texto);
                        console.log(`✅ Mensagem enviada para o último contato (${ultimoContato})`);
                    } catch (err) {
                        console.error("⚠️ Erro ao enviar:", err);
                    }
                }
            }

            // 3️⃣ Broadcast por nomes
            else if (input.toLowerCase().startsWith('broadcast:')) {
                const partes = input.split(':');
                if (partes.length >= 3) {
                    const nomes = partes[1].split(',').map(n => n.trim());
                    const mensagem = partes.slice(2).join(':').trim();
                    await enviarBroadcastPorNome(nomes, mensagem);
                } else {
                    console.log("❌ Formato inválido. Use: broadcast:Nome1,Nome2:mensagem");
                }
            }

            perguntar();
        });
    }

    perguntar();
}

// --- Função de broadcast por nomes ---
async function enviarBroadcastPorNome(nomes, mensagem) {
    try {
        const contatos = await client.getContacts();
        const selecionados = contatos.filter(c => nomes.includes(c.name));

        if (selecionados.length === 0) {
            console.log("❌ Nenhum contato encontrado com esses nomes.");
            return;
        }

        for (const contato of selecionados) {
            try {
                await client.sendMessage(contato.id._serialized, mensagem);
                console.log(`✅ Mensagem enviada para ${contato.name}`);
            } catch (err) {
                console.error(`⚠️ Erro ao enviar para ${contato.name}:`, err);
            }
        }
    } catch (err) {
        console.error("⚠️ Erro ao buscar contatos:", err);
    }
}
