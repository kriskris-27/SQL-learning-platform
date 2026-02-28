import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/index/envconfig.js';

const generateToken = (id: string) => {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const user = await User.create({ email, password });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken((user._id as any).toString()),
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken((user._id as any).toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully. Please remove token from storage.' });
};
