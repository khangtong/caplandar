import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .trim(),
});

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export const ScheduleFormSchema = z.object({
  id: z.number().int().min(1, { message: 'Invalid schedule id.' }).optional(),
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 characters long.' })
    .trim(),
  date: z.date().min(new Date(new Date().getTime() - 86400000), {
    message: 'Date must be started from now.',
  }),
  timeFrom: z.string().length(8, { message: 'Invalid time format.' }).trim(),
  timeTo: z.string().length(8, { message: 'Invalid time format.' }).trim(),
  location: z.string().trim(),
  noti: z.string().trim(),
  notiUnit: z.enum(['m', 'h', 'd', 'w']),
  guests: z.string().trim(),
  category: z
    .number({ message: 'Please select a category.' })
    .min(0, { message: 'Invalid category.' }),
});

export const AddGuestFormSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(2, { message: 'Invalid username or email.' })
    .trim(),
});

export const AddCategoryFormSchema = z.object({
  color: z.string().length(7, { message: 'Invalid category color.' }).trim(),
  name: z.string().min(1, { message: 'Invalid category name.' }).trim(),
});

export const EditCategoryFormSchema = z.object({
  id: z.number().int().min(1, { message: 'Invalid category id.' }),
  color: z.string().length(7, { message: 'Invalid category color.' }).trim(),
  name: z.string().min(1, { message: 'Invalid category name.' }).trim(),
});

export const SearchSchedulesFormSchema = z.object({
  title: z.string().min(1, 'Invalid title').trim().optional(),
  year: z
    .number()
    .int()
    .min(1900, 'Invalid year')
    .max(2099, 'Invalid year')
    .optional(),
  month: z
    .number()
    .int()
    .min(1, 'Invalid month')
    .max(12, 'Invalid month')
    .optional(),
  date: z
    .number()
    .int()
    .min(1, 'Invalid date')
    .max(31, 'Invalid date')
    .optional(),
  location: z.string().min(1, 'Invalid location').trim().optional(),
  category: z.number().int().min(0, 'Invalid category').optional(),
});

export const EditProfileFormSchema = z.object({
  avatar: z.string().trim().nullable(),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
});

export const ChangePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long.')
      .trim(),
    newPassword: z
      .string()
      .min(6, 'The new password must be at least 6 characters long.')
      .trim(),
    confirmPassword: z
      .string()
      .min(6, 'The confirmation password must be at least 6 characters long.')
      .trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The new password and confirmation password don't match.",
    path: ['confirmPassword'],
  });

export type User =
  | {
      id: string;
      username: string;
      email: string;
      password: string;
      avatar: string | null;
    }
  | undefined;

export type Category =
  | {
      id: number;
      name: string;
      color: string;
    }
  | undefined;

export const monthsInWord = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
