# Use the node:22-alpine base image
FROM node:22-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy your application code
COPY package.json server.js index.html style.css app.js ./
# Create folder for photos if doesn’t exist
RUN mkdir -p photos
# Expose the port the app runs on (usually 8080 for this app)
EXPOSE 3000
# Define volume for /app/photos
VOLUME ["/app/photos"]
# Start the application
CMD ["node", "server.js"]