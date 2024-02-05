# Base image
FROM node:21-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
# RUN yarn deploy

RUN echo "Hello from Dockerfile"

# Expose the port on which the app will run
# EXPOSE 5000

# Start the server using the production build
# CMD ["yarn", "start:prod"]