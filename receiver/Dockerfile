FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "--env-file=.env", "receiver.js"]



