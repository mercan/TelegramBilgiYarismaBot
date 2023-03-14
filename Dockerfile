FROM node:19.5.0-alpine

WORKDIR /usr/app

COPY . .

# install dependencies
RUN npm install --only=production && npm install -g typescript --force

RUN tsc --version

# Typescript Build
RUN npm run build

# Run the app
CMD [ "npm", "start" ]