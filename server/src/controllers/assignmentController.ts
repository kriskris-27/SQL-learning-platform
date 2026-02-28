import { type Request, type Response } from 'express';
import Assignment from '../models/Assignment.js';

export const getAssignments = async (req: Request, res: Response) => {
    try {
        const assignments = await Assignment.find({}, 'title description difficulty');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error });
    }
};

export const getAssignmentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignment details', error });
    }
};
