# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the built application
COPY ./dist/apps/context-gpt-backend ./dist

# Expose the port the app runs on
EXPOSE 8000

# Run the troubleshooting script, then start the application
CMD ["node", "dist/main.js"]
