'use client';
import { useState, useEffect } from 'react';

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
  eligibility: string;
  program: string;
  renewal: string;
  income: string;
}

export default function Home() {
  const [programsData, setProgramsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [programNameQuery, setProgramNameQuery] = useState('');
  const [coverageQuery, setCoverageQuery] = useState('');
  const [programTypeQuery, setProgramTypeQuery] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(
          `/api/programs?program_id=${searchQuery}&program_name=${programNameQuery}&coverage_eligibilities=${coverageQuery}&program_type=${programTypeQuery}`
        );
        const data = await response.json();
        setProgramsData(data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [searchQuery, programNameQuery, coverageQuery, programTypeQuery]);

  const filteredPrograms = programsData;

  if (isLoading) {
    return <div className="p-8 max-w-4xl mx-auto">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Available Programs</h1>
      
      <div className="flex gap-8">
        {/* Search Filters */}
        <div className="w-1/4 space-y-4">
          <input
            type="text"
            placeholder="Search by Program ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <input
            type="text"
            placeholder="Search by Program Name..."
            value={programNameQuery}
            onChange={(e) => setProgramNameQuery(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <input
            type="text"
            placeholder="Search by Coverage..."
            value={coverageQuery}
            onChange={(e) => setCoverageQuery(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <input
            type="text"
            placeholder="Search by Program Type..."
            value={programTypeQuery}
            onChange={(e) => setProgramTypeQuery(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Program Cards */}
        <div className="w-3/4 space-y-8">
          {filteredPrograms.map((programData: {
            forms: Form[];
            requirements: Requirement[];
            details: ProgramDetails;
            benefits: Benefit[];
            funding: {
              evergreen: string;
              current_funding_level: string;
            };
            coverage_eligibilities: string[];
            program_type: string;
            program_id: string;
            program_name: string;
          }) => (
            <div key={programData.program_id} className="border rounded-xl p-6 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm dark:text-white">
              <h2 className="text-2xl font-bold mb-6">{programData.program_name}</h2>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Basic Information</h3>
                  <p>Program ID: {programData.program_id}</p>
                  <p>Program Type: {programData.program_type}</p>
                  <p>Coverage: {programData.coverage_eligibilities.join(", ")}</p>
                </section>

                {/* Benefits */}
                <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Benefits</h3>
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
                <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Program Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Eligibility:</h4>
                      <p>{programData.details.eligibility}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Program Information:</h4>
                      {programData.details.program.split("\n").map((line: string, index: number) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium">Renewal:</h4>
                      <p>{programData.details.renewal}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Income Requirement:</h4>
                      <p>{programData.details.income}</p>
                    </div>
                  </div>
                </section>

                {/* Requirements */}
                <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Requirements</h3>
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
                <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Forms</h3>
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
                <section className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Funding</h3>
                  <p>Evergreen: {programData.funding.evergreen}</p>
                  <p>Current Funding Level: {programData.funding.current_funding_level}</p>
                </section>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
