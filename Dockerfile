FROM node:14

WORKDIR /SQL

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# VOLUME [ "/app/node_modules" ]

CMD [ "npm", "run", "dev" ]
