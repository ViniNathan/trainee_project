# Backend com Bun

Este é um projeto de backend utilizando Bun como runtime JavaScript, com Express para criação de APIs, Axios para requisições HTTP e JSDOM para manipulação de DOM no servidor.

## Dependências

- [Bun](https://bun.sh) - Runtime JavaScript rápido e moderno
- [Express](https://expressjs.com) - Framework web para Node.js
- [Axios](https://axios-http.com) - Cliente HTTP baseado em promises
- [JSDOM](https://github.com/jsdom/jsdom) - Implementação JavaScript de diversos padrões web

## Instalação

```bash
bun install
```

## Execução

Para iniciar o servidor:

```bash
bun start
```

Para desenvolvimento com hot reload:

```bash
bun dev
```

## Endpoints

- `GET /`: Retorna uma mensagem confirmando que a API está funcionando
- `GET /exemplo`: Exemplo de uso do Axios e JSDOM para extrair informações de uma página web
