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

## Project Setup

1. Write the .env file

At the root of the project write the .env file, there is a .env.example with all the variables that should be set with some default values. The sensitive data is not on the repository.

2. Install dependencies

```
yarn install
```

## Run the project

### Processing the data (ETL)

There are two different options to process the data, the first option is running a local Ollama server with the Mistral model, which would be the default way. The other option is to use an OpenAI API Key, this key should be set on the .env file.

#### To execute with Ollama

```
$ yarn etl
```

another option is to execute

```
$ yarn etl ollama
```

#### To execute with OpenAI

```
$ yarn etl openai
```

After executing one of this commands and when the process finishes, inside the folder `output_programs` a new file will be created with the following structure `${programName}-transformed.json`

### Running the server

When executing the server, the ETL process from will be called and it also will start an express server to serve the API endpoints

To start the server execute

```
$ yarn dev
```

#### Testing the endpoints

The endpoints can be tested from a browser, for example [http://localhost:3000/programs/11757](http://localhost:3000/programs/11757), or there is a folder called `http` that has the http calls to test the server, the files inside the folder will require VSCode and the following REST Client [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)