import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ProgramTransformOutput } from '../types/program';

const getPrograms = (): ProgramTransformOutput[] => {
    const directoryPath = path.join(process.cwd(), 'output_data');
    const files = fs.readdirSync(directoryPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const allPrograms: ProgramTransformOutput[] = [];
    for (const file of jsonFiles) {
        const filePath = path.join(directoryPath, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const programs = JSON.parse(fileData);
        if (Array.isArray(programs)) {
            allPrograms.push(...programs);
        } else {
            allPrograms.push(programs);
        }
    }
    
    return allPrograms;
};

export const getProgramById = async (req: Request, res: Response) => {
    try {
        const programs = getPrograms();
        const programId = req.params.programId;
        const program = programs.find((p: ProgramTransformOutput) => p.program_id === programId);

        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }
        
        return res.status(200).json(program);
    } catch (error) {
        console.error('Error reading program data:', error);
        return res.status(500).json({ 
            error: 'Failed to read program data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getAllPrograms = async (req: Request, res: Response) => {
    try {
        let programs = getPrograms();
        
        // Apply filters based on query parameters
        if (Object.keys(req.query).length > 0) {
            programs = programs.filter(program => {
                return Object.entries(req.query).every(([key, value]) => {
                    // Skip undefined or null query values
                    if (!value) return true;
                    
                    // Special handling for details field
                    if (key === 'details') {
                        const queryValue = String(value).toLowerCase();
                        const details = program.details;
                        
                        // Search within all relevant detail fields
                        return (
                            details.eligibility?.toLowerCase().includes(queryValue) ||
                            details.program?.toLowerCase().includes(queryValue) ||
                            details.renewal?.toLowerCase().includes(queryValue) ||
                            details.income?.toLowerCase().includes(queryValue) ||
                            false
                        );
                    }
                    
                    // Handle case where program property doesn't exist
                    if (!(key in program)) return false;
                    
                    // Convert both to strings for comparison
                    const programValue = String(program[key as keyof ProgramTransformOutput]).toLowerCase();
                    const queryValue = String(value).toLowerCase();
                    
                    return programValue.includes(queryValue);
                });
            });
        }

        return res.status(200).json(programs);
    } catch (error) {
        console.error('Error reading program data:', error);
        return res.status(500).json({ 
            error: 'Failed to read program data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
