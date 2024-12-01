<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

## Iniciar a aplicação

- Copie o conteúdo do .env.example para uma .env em /mtg-api
- Garanta que o Docker está instalado e rodando
- Execute:
  ```
  docker-compose up --build
  ```
- Assim a aplicação irá iniciar junto com os logs de todos os serviços.

## Swagger

- /api

## Rodar a aplicação localmente

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Prisma

```bash
# aplicar migrations
$ npx prisma db push

# abrir o banco porta 5555
$ npx prisma studio
```

## Teste

```bash
# unit tests
$ npm run test
```

## Decks

- O método **GET /deck** retorna todos os baralhos da aplicação, podendo colocar true na flag showCards para retornar as cartas associadas a esse baralho

### POST/ deck/seed/\{deck_name\}\/\{color}/

- Rota para seedar aleatóriamente da api do scyfall um deck.
- Informe as cores e o nome do deck.

### POST/ deck/import

- Há um exemplo `mtg-api/deck.json`
- Recebe um JSON contendo o nome do baralho e um array de cartas, que serão importadas para um deck com o nome especificado.
- O array de cards deve estar nesse formato:

```json
[
  {
    "id": "7ad77890-cf97-4707-ab31-be0f5be0e120",
    "name": "A-Bruenor Battlehammer",
    "released_date": "2021-07-23T00:00:00.000Z",
    "mana_cost": "{2}{R}{W}",
    "type": "Legendary Creature — Dwarf Warrior",
    "text": "Each creature you control gets +2/+0 for each Equipment attached to it.\n{0}: Attach target Equipment you control to target creature you control. Activate only as a sorcery and only once each turn.",
    "power": 5,
    "toughness": 4,
    "colors": [
      "R",
      "W"
    ],
    "cmc": 4,
    "rarity": "UNCOMMON",
    "price_in_usd": 0,
    "foil_price_in_usd": 0
  },
 ...
]
```

## Mensageria

- A aplicação está utilizando RabbitMQ com duas filas

### deck_import_queue

- Essa fila é responsável por finalizar o processo de importação do baralho, salvando no banco.

### deck_updates_queue

- Essa fila é responsável por receber mensagens de atualização de deck e enviar notificações para o "frontend" (websocket-service) via websocket.

## Websocket

### websocket-service

- A aplicação websocket-service é responsável por se conectar com o worker de Deck e notificar atualizações, criações e deleções de decks.

## Cache

- Todos os findAll da aplicação contém sistema de Cache

### Estatísticas

### `/decks?showCards=true`

- **Duração:** 50 segundos
- **Conexões:** 100
- **Total de Requisições:** 8.000
- **Bytes Lidos:** 2.46 GB

### Estatísticas de Latência:

- **Latência 2.5%:** 534 ms
- **Latência 50% (mediana):** 562 ms
- **Latência 97.5%:** 1468 ms
- **Latência 99%:** 1529 ms
- **Latência Média:** 635.4 ms
- **Desvio Padrão:** 237.56 ms
- **Máxima:** 1787 ms

### Estatísticas de Requisições:

- **Requisições por segundo (Avg):** 156.94

### `/decks/no-cache?showCards=true`

- **Duração:** 50 segundos
- **Conexões:** 100
- **Total de Requisições:** 5.000
- **Bytes Lidos:** 1.52 GB

### Estatísticas de Latência:

- **Latência 2.5%:** 969 ms
- **Latência 50% (mediana):** 1023 ms
- **Latência 97.5%:** 1106 ms
- **Latência 99%:** 1123 ms
- **Latência Média:** 1021.9 ms
- **Desvio Padrão:** 64.47 ms
- **Máxima:** 1571 ms

### Estatísticas de Requisições:

- **Requisições por segundo (Avg):** 97.1
- **Bytes por segundo (Avg):** 30.5 MB

### Comparação

- **Requisições:**
  - O primeiro teste (`/decks?showCards=true`) processou **8.000 requisições** em 50 segundos, enquanto o segundo teste (`/decks/no-cache?showCards=true`) processou **5.000 requisições** no mesmo período. Isso indica que o primeiro endpoint é mais eficiente em lidar com carga de requisições.
- **Latência:**
  - A latência média do primeiro teste foi **635.4 ms**, comparada a **1021.9 ms** no segundo teste. O primeiro teste teve uma latência significativamente menor, indicando um melhor desempenho na entrega de respostas.
- **Taxa de Transferência:**
  - O primeiro teste transferiu uma média de **49.3 MB/s**, enquanto o segundo teste transferiu **30.5 MB/s**. O primeiro endpoint teve uma taxa de transferência maior.
