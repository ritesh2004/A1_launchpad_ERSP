import { z } from 'zod';

export const userCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["user", "admin", "servicer"]).optional(),
});

export const userLoginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100)
});