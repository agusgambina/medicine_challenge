import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ProgramTransformOutput } from '../types/program';

const getPrograms = (): ProgramTransformOutput[] => {
    const directoryPath = path.join(process.cwd(), 'output_programs');
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
