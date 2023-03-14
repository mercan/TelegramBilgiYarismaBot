FROM node:19-alpine AS builder

# Create app directory
WORKDIR /usr/app

# Copy the package.json file
COPY package.json .

# install dependencies
RUN npm install\
        && npm install typescript -g

# Copy the source code
COPY . .

# Typescript Build
RUN tsc

# Run the app
CMD [ "npm", "start" ]