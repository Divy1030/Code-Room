import jwt from "jsonwebtoken";
import redis from '../services/redis.service.js';

export const authUser=async (req, res, next) =>{
    try{
        const token=req.cookies.token || req.headers.authorization.split(' ')[1];
        if(!token) return res.status(401).json({error:'Unauthenticate'});
        const isBlackListed=await redis.get(token);
        if(isBlackListed) return res.status(401).json({error:'Unauthenticate'});
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(error){
        res.status(401).json({error:'Unauthenticate'});
    }
}