FROM node:19.5.0-alpine

# Create app directory
WORKDIR /usr/app

# Copy the package.json file
COPY package.json .

# install dependencies
RUN npm install --only=production && npm install -g typescript

# Copy the source code
COPY . .

# Typescript Build
RUN tsc

# Run the app
CMD [ "npm", "start" ]