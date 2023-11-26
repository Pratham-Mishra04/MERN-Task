# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle your app source code inside the Docker image
COPY . .

# Expose the port that your app will run on
EXPOSE 8000

# Define the command to run your application
CMD ["npm", "run", "dev"]
