FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./

# install dependencies
RUN npm install --only=production

COPY . .

# Typescript Build
RUN npm run build

# Run the app
CMD [ "npm", "start" ]