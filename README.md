# backend-todo

This is Node.js Simple Backend project. We are using Docker to containerize and running the application container along with mango DB container together in docker-compose file.
The project stack consist of Docker file and docker-compose.yaml file. 
Steps to follow:
1. Clone the project to local machine.
2. To the cloned project stack add .env file with below parameter 
SERVER_PORT = 3000
MONGO_HOST = mongo
MONGODB_PORT = 27017
DATABASE_NAME = TodoApp
MONGODB_URI = mongodb://mongo:27017/TodoApp
3. Run the docker compose file using "docker-compose up -d"
4. Run this in your local machine "http://localhost:3000" or replace the localhost wiith your machine ip and serch on the web browser. Ex: "http://0.0.0.0:300.
