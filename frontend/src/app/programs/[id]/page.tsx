"use client";

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, use } from 'react';

interface Benefit {
  name: string;
  value: string;
}

interface Requirement {
  name: string;
  value: string;
}

interface Form {
  name: string;
  url: string;
}

interface ProgramDetails {
  funding: {
    evergreen: string;
    current_funding_level: string;
  };
  forms: {
    name: string;
    url: string;
  }[];
  requirements: {
    name: string;
    value: string;
  }[];
  details: {
    eligibility: string;
    program: string;
    renewal: string;
    income: string;
  };
  benefits: {
    name: string;
    value: string;
  }[];
  coverage_eligibilities: string[];
  program_type: string;
  program_id: string;
  program_name: string;
  eligibility: string;
  program: string;
  renewal: string;
  income: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Home({ params }: PageProps) {
  const { id } = use(params);
  const [programData, setProgramData] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/programs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch program data');
        }
        const data = await response.json();
        setProgramData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!programData) {
    return <div className="p-8">No program data available</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{programData.program_name}</h1>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg dark:text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Basic Information</h2>
          <p>Program ID: {programData.program_id}</p>
          <p>Program Type: {programData.program_type}</p>
          <p>Coverage: {programData.coverage_eligibilities.join(", ")}</p>
        </section>

        {/* Benefits */}
        <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg dark:text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Benefits</h2>
          {programData.benefits.map((benefit: Benefit) => (
            <div key={benefit.name} className="mb-2">
              <span className="font-medium">
                {benefit.name.split("_").join(" ").toUpperCase()}:
              </span>{" "}
              {benefit.value}
            </div>
          ))}
        </section>

        {/* Program Details */}
        <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg dark:text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Program Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Eligibility:</h3>
              <p>{programData.details.eligibility}</p>
            </div>
            <div>
              <h3 className="font-medium">Program Information:</h3>
              {programData.details.program.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div>
              <h3 className="font-medium">Renewal:</h3>
              <p>{programData.details.renewal}</p>
            </div>
            <div>
              <h3 className="font-medium">Income Requirement:</h3>
              <p>{programData.details.income}</p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg dark:text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Requirements</h2>
          {programData.requirements.map((req: Requirement) => (
            <div key={req.name} className="mb-2">
              <span className="font-medium">
                {req.name.split("_").join(" ").toUpperCase()}:
              </span>{" "}
              {req.value}
            </div>
          ))}
        </section>

        {/* Forms */}
        <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg dark:text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Forms</h2>
          {programData.forms.map((form: Form) => (
            <div key={form.name}>
              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {form.name}
              </a>
            </div>
          ))}
        </section>

        {/* Funding */}
        <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg dark:text-gray-200">
          <h2 className="text-xl font-semibold mb-3">Funding</h2>
          <p>Evergreen: {programData.funding.evergreen}</p>
          <p>Current Funding Level: {programData.funding.current_funding_level}</p>
        </section>
      </div>
    </div>
  );
}
