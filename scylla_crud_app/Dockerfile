# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /scylla_crud_app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (your app listens on 8003)
EXPOSE 8003

# Start the app
# CMD ["node", "app.js"]
RUN npm install -g nodemon
CMD ["nodemon", "app.js"]
