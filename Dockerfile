FROM node:19.5.0-alpine

WORKDIR /usr/app

COPY package*.json ./

# install dependencies
RUN npm install -g typescript && npm install --only=production

COPY . .

# Typescript Build
RUN npx tsc

# Run the app
CMD [ "npm", "start" ]