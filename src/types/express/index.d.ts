import express from 'express';

declare global {
    namespace Express {
        interface Request {
            userJWT?: string | jwt.JwtPayload
        }
    }
}