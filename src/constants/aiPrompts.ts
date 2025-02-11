export const AI_PROMPTS = {
  ELIGIBILITY_DETAILS: (details: string) => [
    {
      role: 'system',
      content: 'You are a helpful assistant that simplifies eligibility requirements. Parse and summarize the most important eligibility criteria, focusing on age limits, geographic restrictions, or insurance conditions. Provide a concise, clear response.'
    },
    {
      role: 'user',
      content: `Please analyze these eligibility requirements and provide a simplified version focusing on the key insurance and residency requirements. Format the response as a JSON object with a single 'eligibility' field containing the simplified string:\n\n${details}`
    }
  ],

  US_RESIDENCY_CHECK: (details: string) => [
    {
      role: 'system',
      content: "You are an assistant that analyzes eligibility requirements to determine if US residency is required. You must respond with a JSON object containing a single 'requiresUSResidency' boolean field. Set it to true if the text indicates US residency or US territory residency is required, false if not."
    },
    {
      role: 'user',
      content: `Analyze these requirements and determine if US residency is required. Respond with true if US residency/territory is required, false if not:\n\n${details}`
    }
  ],

  INSURANCE_COVERAGE_CHECK: (details: string) => [
    {
      role: 'system',
      content: "You are an assistant that analyzes eligibility requirements to determine if a program or service is covered by insurance. You must respond with a JSON object containing a single 'isCoveredByInsurance' boolean field. Set it to true if the text indicates the program/service is covered by insurance, false if not."
    },
    {
      role: 'user',
      content: `Analyze these requirements and determine if this program/service is covered by insurance. Respond with true if it is covered by insurance, false if not:\n\n${details}`
    }
  ],

  MINIMUM_AGE_CHECK: (details: string) => [
    {
      role: 'system',
      content: 'You are an assistant that analyzes eligibility requirements to determine minimum age requirements. You must respond with a JSON object containing a single "minimumAge" field with a number value. If there is no age restriction mentioned or if you cannot determine the age requirement, return 18. If a specific minimum age is stated (like "must be 21 years or older"), return that age. Examples of valid responses: {"minimumAge": 21} or {"minimumAge": 18}'
    },
    {
      role: 'user',
      content: `Please analyze these requirements and extract any minimum age requirement. If no age restriction is mentioned or if you cannot determine it, use 18 as the default. If a specific minimum age is mentioned, use that age. Respond with a JSON object containing only the "minimumAge" field with a number value:\n\n${details}`
    }
  ],

  ELIGIBILITY_LENGTH_CHECK: (details: string) => [
    {
      role: 'system',
      content: 'You are an assistant that analyzes eligibility requirements to determine the eligibility length. You must respond with a JSON object containing a single "eligibilityLength" field with a number value. If there is no eligibility length mentioned, return 12. If a specific eligibility length is stated, return that length. Examples of valid responses: {"eligibilityLength": 12} or {"eligibilityLength": 24}'
    },
    {
      role: 'user',
      content: `Please analyze these requirements and extract any eligibility length requirement. If no eligibility length is mentioned, return 12. If a specific eligibility length is stated, return that length. Respond with a JSON object containing only the "eligibilityLength" field with a number value:\n\n${details}`
    }
  ]
}; 