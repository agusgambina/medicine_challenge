## Docker Ollama

This project uses Docker Compose to run Ollama with the Mistral model.

### Prerequisites

- Docker
- Docker Compose

### Getting Started

1. Start the Ollama container:

````
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