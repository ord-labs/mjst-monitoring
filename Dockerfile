FROM node:20-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

RUN npm run build

CMD ["node", "./dist/src"]
