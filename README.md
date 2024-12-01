https://github.com/TI-UNICESUMAR/2024-desafio-profissional-v-ESOFT5S-B/issues/23

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## SWAGGER

- O swagger esta presente na rota http://localhost:8000/api

## Iniciar a aplicação

- Copie o conteúdo do .env.example para uma .env
- Garante que o Docker está instalado e rodando
- Rode docker-compose up -d
- npx prisma migrate dev
- npm run start:dev

## User com role admin

- Para criar um usuário com a role ADMIN, abra o prisma studio e altere a role de um usuário criado na rota /signup
- Após o docker estar rodando e aplicar as migrações no banco
- Rode npx prisma studio

## Requisitos

1 - Permita que mais de um baralho seja criado em sua aplicação

- Mais de um baralho pode ser criado usando o método **POST** **/DECK**, o deck contém um conjunto de cartas, que é relacionado com a entidade CardDeck

2 - Crie uma rota para listar todos os baralhos (somente um usuário com permissão admin pode usar essa rota)

- O método **GET /deck** só pode ser acessado por users com a role ADMIN, ela retorna todos os baralhos da aplicação, podendo colocar true na flag showCards para retornar as cartas associadas a esse baralho

3 - Crie uma rota para listar somente os baralhos do jogador que está logado

- O método GET /deck/me retorna os decks associados ao user logado, retirando o userId presente no JWT

4 - Adicione cacheamento na rota de listar para listar todos os baralhos do jogador logado (Recomendação: [https://docs.nestjs.com/techniques/caching](https://docs.nestjs.com/techniques/caching))

- Todos os findAll da aplicação contém sistema de Cache

5 - Crie uma rota onde seja possível "importar" um baralho via json, e valide se esse baralho segue as regras do commander.

- A rota POST scyfall/import recebe um JSON contendo o nome do baralho e um array de cartas, que serão importadas para um deck com o nome especificado, o array de “cards” deve conter cartas no formato especificado no deck.json presente na root do projeto, a validação ocorre com o transfomer, presente no DTO de import

6 - Realize os testes de performance e indique o comparativo de quantas vezes mais requisições e tempo de resposta você conseguiu atender utilizando a listagem de baralhos com cache e sem cache.

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

## Comparação

- **Requisições:**
  - O primeiro teste (`/decks?showCards=true`) processou **8.000 requisições** em 50 segundos, enquanto o segundo teste (`/decks/no-cache?showCards=true`) processou **5.000 requisições** no mesmo período. Isso indica que o primeiro endpoint é mais eficiente em lidar com carga de requisições.
- **Latência:**
  - A latência média do primeiro teste foi **635.4 ms**, comparada a **1021.9 ms** no segundo teste. O primeiro teste teve uma latência significativamente menor, indicando um melhor desempenho na entrega de respostas.
- **Taxa de Transferência:**
  - O primeiro teste transferiu uma média de **49.3 MB/s**, enquanto o segundo teste transferiu **30.5 MB/s**. O primeiro endpoint teve uma taxa de transferência maior.
