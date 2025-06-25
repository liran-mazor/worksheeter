FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]