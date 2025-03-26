## Scraping da Amazon

Este projeto oferece uma API para realizar scraping da página de resultados de pesquisa da Amazon.

### Requisitos

- Node.js 14+ ou Bun runtime
- Conexão com a internet

## Dependências

- [Bun](https://bun.sh) - Runtime JavaScript rápido e moderno
- [Express](https://expressjs.com) - Framework web para Node.js
- [Axios](https://axios-http.com) - Cliente HTTP baseado em promises
- [JSDOM](https://github.com/jsdom/jsdom) - Implementação JavaScript de diversos padrões web

### Instalação

```bash
# Instalar dependências
npm install
# ou
bun install
```

### Execução

```bash
# Iniciar o servidor
bun start

# Iniciar em modo de desenvolvimento (com hot reload)
bun run dev
```

### Endpoints

- **GET /api/scrape**
  - Query params:
    - `keyword`: Palavra-chave para pesquisar na Amazon
  - Retorna:
    - JSON com os produtos encontrados, incluindo título, avaliação, número de avaliações e URL da imagem

### Exemplo de uso

```
GET http://localhost:3000/api/scrape?keyword=smartphone
```

Exemplo de resposta:
```json
{
  "keyword": "smartphone",
  "products": [
    {
      "title": "Smartphone XYZ 128GB",
      "rating": "4.5",
      "reviewCount": "1252",
      "imageUrl": "https://www.amazon.com.br/images/product.jpg"
    },
    // ... mais produtos
  ]
}
```
