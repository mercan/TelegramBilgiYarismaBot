FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./

# install dependencies
RUN npm install --only=production && npm cache clean --force && npm install -g typescript

COPY . .

# Typescript Build
RUN npm run build

# Run the app
CMD [ "npm", "start" ]