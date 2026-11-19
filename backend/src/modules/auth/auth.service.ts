import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export class AuthError extends Error {
    constructor(message: string,public statusCode: number) {
        super(message);
        this.name = "AuthError";
    }   
}

export const authService = {
   async register(name: string, email: string, password: string) {

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await authRepository.findByemail(normalizedEmail);

        if (existingUser) {
            throw new AuthError("Email is already registered.", 409);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await authRepository.createUser({
            name,
            email: normalizedEmail,
            passwordHash
        });

        const token = jwt.sign(
        { sub: String(newUser.id) },
            JWT_SECRET,
        { expiresIn: '1h' }
        );

        return { user: newUser, token };
   },
   async login(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase(); 

        const user = await authRepository.findByemail(normalizedEmail);

        if (!user) {
            throw new AuthError("Invalid email or password.", 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            throw new AuthError("Invalid email or password.", 401);
        }

        const token = jwt.sign(
            { sub: String(user.id) },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }, token }
        },  
        
    async getProfile(userId: number) {
        const user = await authRepository.findById(userId);
        if (!user) {
            throw new AuthError("User not found.", 404);
        }
        return user;
    }
}