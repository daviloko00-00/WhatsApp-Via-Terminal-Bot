# WhatsApp Terminal Bot

Um bot para WhatsApp Web que permite:

- Receber mensagens e responder automaticamente.
- Enviar mensagens para um número específico via terminal.
- Responder ao último contato que enviou mensagem.
- Fazer broadcast para contatos selecionados pelo nome.

Tudo usando Node.js e [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 16.x
- WhatsApp no celular
- Conexão com a internet

---

## Instalação

1. Clone este repositório:

```bash
git clone https://github.com/seuusuario/whatsapp-terminal-bot.git
cd whatsapp-terminal-bot

---

Instale as dependências:
```bash
npm install whatsapp-web.js qrcode-terminal readline

---

Execute o boot:

```bash
node index.js
