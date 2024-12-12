FROM node:20.17.0-alpine

WORKDIR /app/data
COPY ./data ./

WORKDIR /app/server
COPY ./server/package*.json ./
RUN npm install
COPY ./server/src ./src
COPY ./server/tsconfig.json ./
COPY ./server/nodemon.json ./
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "dev"]
