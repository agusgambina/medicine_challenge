import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface Program {
    id: string;
    // Add other program properties as needed
}

const getPrograms = (): Program[] => {
    const filePath = path.join(process.cwd(), 'output', 'dupixent-transformed.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
};

export const getProgramById = async (req: Request, res: Response) => {
    try {
        const programs = getPrograms();
        const programId = req.params.programId;
        const program = programs.find((p: Program) => p.id === programId);

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
