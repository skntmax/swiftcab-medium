FROM node:20

WORKDIR /app

COPY package*.json . 
RUN npm install

# Install typescript & dotenv-cli globally
RUN npm install -g typescript dotenv-cli

COPY . .

# Use dotenv-cli to build with env vars loaded from .env.development
RUN dotenv -e .env.production -- npx tsc

CMD [ "npm", "run" ,"init:kafka:driver_consumer_pool:production" ]
