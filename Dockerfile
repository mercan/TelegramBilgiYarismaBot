FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./

# install dependencies
RUN npm install --only=production && npm install -g typescript

COPY . .

# Typescript Build
RUN npx tsc

# Run the app
CMD [ "npm", "start" ]