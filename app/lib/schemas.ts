import z from 'zod';

// ✅ Login form
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ✅ Тип для state
export type FormState =
  | {
      errors?: {
        email?: string;
        password?: string;
      };
      message?: string;
    }
  | undefined;

// ✅ Register form
export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
