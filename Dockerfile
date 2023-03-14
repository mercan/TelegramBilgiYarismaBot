FROM node:19.5.0-alpine

WORKDIR /usr/app

COPY . .

# install dependencies
RUN npm install -g typescript && npm install --only=production

# Typescript Build
RUN npm run build

# Run the app
CMD [ "npm", "start" ]