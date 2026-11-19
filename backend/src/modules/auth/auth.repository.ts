import prisma from "../../config/prisma.js";

export const authRepository = {
    findByemail(email : string) {
        return prisma.user.findUnique({
            where : { email }
        });
    },
    
    createUser(data: { name: string, email: string, passwordHash: string }) {
        return prisma.user.create({
            data,
            select: {
                id: true,
                name:true,
                email: true,
                createdAt: true
            }
        });
    },

    findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name:true,
                email: true,
                createdAt: true
            }
        });
    }
}