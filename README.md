# Medicine Challenge

## Prequisites

- Docker / Docker Compose
- NodeJS
- Yarn

## Docker Ollama

This project uses Docker Compose to run Ollama with the Mistral model.

### Getting Started

1. Start the Ollama container:

```
$ docker compose up -d
```

2. Pull the Mistral model:

```
docker exec ollama ollama pull mistral
```

3. Verify the setup:

```
docker ps
```

You should see the Ollama container running on port 11434.

### Project Setup

1. Write the .env file

At the root of the project write the .env file, there is a .env.example with all the variables that should be set with some default values. The sensitive data is not on the repository.

2. Install dependencies

```
yarn install
```


