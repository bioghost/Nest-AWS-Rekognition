# Use the official Node.js image as base
FROM node:19

# Set the working directory in the container
WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Nest.js dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:dev"]
