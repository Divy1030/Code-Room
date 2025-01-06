import User from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redis from '../services/redis.service.js';

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const loginController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid login credentials');
        }
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            throw new Error('Invalid login credentials');
        }
        const token = await user.generateJWT();
        res.status(200).json({ user, token });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const profileController=async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const logoutController=async (req, res) => {
    try {
        const token=req.cookies.token || req.headers.authorization.split(' ')[1];
        redis.set(token, 'logout','EX',60*60*24);
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}