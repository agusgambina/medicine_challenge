# Medicine Challenge

A service to process and serve medical program data using AI models.

## Prerequisites

- Docker / Docker Compose
- NodeJS (v18 or higher recommended)
- Yarn (v1.x)

## Setup and Installation

### 1. Docker Ollama Setup

This project uses Docker Compose to run Ollama with the Mistral model.

1. Start the Ollama container:
```bash
docker compose up -d
```

2. Pull the Mistral model:
```bash
docker exec ollama ollama pull mistral
```

3. Verify the setup:
```bash
docker ps
```

The Ollama container should be running on port 11434.

### 2. Project Configuration

1. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables in `.env` with your configuration
   - For OpenAI integration, add your API key (optional)

2. Install project dependencies:
```bash
yarn install
```

## Usage

### Data Processing (ETL)

The ETL process can be run using either Ollama (local) or OpenAI's API.

#### Using Ollama (Default)
```bash
yarn etl
# or
yarn etl ollama
```

#### Using OpenAI
```bash
yarn etl openai
```

After processing, transformed data files will be generated in the `output_programs` directory as `${programName}-transformed.json`.

### API Server

Start the express server
```bash
yarn dev
```

The server will be available at `http://localhost:3000`.

#### API Endpoints

- Get program by ID: `GET /programs/:id`
  Example: http://localhost:3000/programs/11757

#### Testing API Endpoints

You can test the endpoints using:
1. Your browser
2. The provided HTTP files in the `http` directory (requires VSCode with REST Client extension)
   - Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
   - Open files in the `http` directory
   - Click "Send Request" to test endpoints

### Running Tests

Execute the test suite:
```bash
yarn test
```

## Project Structure

```
├── http/            # API test files
├── data/            # Files to be processed
├── output_programs/ # Processed data output
├── src/             # Source code
├── tests/           # Test files
└── .env.example     # Environment variables template
```

## Additional information

The dataset is processed after executing the main function. The output file has the same structure as the `Expected Output Structure` in the statement, with one addition that it is the program ID.

Since each field has its type, the output has the following schema, which would standardize the output.
Each field is obtained in the following way

```
{
  program_id: 'It comes from the input file and it is the ProgramID';
  program_name: 'It comes from the input file and it is the ProgramName';
  coverage_eligibilities: 'It comes from the input file and it is the CoverageEligibilities';
  program_type: 'It comes from the input file and it is the AssistanceType';
  benefits: 'It is an array with two items `max_annual_savings` and `min_out_of_pocket`. Where, the minimum out of pocket is 0, the maximum annual      savings is the difference between the annual max and the maximum benefit, the minimum out of pocket is 0 if there is no income requirement.';
  details: {
    eligibility: 'This is processed by the AI service, which parses and summarizes the most important eligibility criteria';
    program: 'It comes from the input file and it is the ProgramDetails';
    renewal: 'It comes from the input file and it is the AddRenewalDetails';
    income: 'It comes from the input file and it is the IncomeDetails and if it is null it returns `Not Required`';
  };
  requirements: [
    {
      name: 'us_residency',
      value: 'This is processed by the AI service, which returns if US residence is required'
    },
    {
      name: 'minimum_age',
      value: 'This is processed by the AI service, which returns if US residence is required and it returns 18 by default'
    },
    {
      name: 'insurance_coverage',
      value: 'This is processed by the AI service, which returns insurance covers the program, it returns false by default'
    },
    {
      name: 'eligibility_length',
      value: 'This is processed by the AI service, which returns the eligibility length and returns 12 months by default'
    },
  ],
  forms: [
    {
      name: 'Enrollment Form',
      url: 'It comes from the input file and it is the EnrollmentURL';
    }
  ];
  funding: {
    evergreen: 'If not FundLevelType or if FundLevelType includes evergreen returns true, it returns false otherwise';
    current_funding_level: 'It returns the FundLevelType or `Data Not Available` if FundLevelType is null';
  };
}
```

## Cache

This repository uses the library `memory-cache` for API efficiency.