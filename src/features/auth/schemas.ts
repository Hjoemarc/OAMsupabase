import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.string().email('Please enter a valid email address')),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),
    email: z.string().trim().toLowerCase().pipe(z.string().email('Please enter a valid email address')),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type AuthActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
};
