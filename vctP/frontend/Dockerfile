FROM node:14

WORKDIR /app/frontend

COPY frontend/package.json ./
RUN npm install

COPY frontend/ .

CMD ["npm", "start"]
