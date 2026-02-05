/**
 * Request Validation Schemas using Zod
 * @module validation
 */

import { z } from 'zod';

/**
 * Custom error messages for better UX
 */
const errorMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must be at most ${max} characters`,
  uuid: (field: string) => `${field} must be a valid UUID`,
};

/**
 * Project initialization request schema
 */
export const initProjectSchema = z.object({
  idea: z.string()
    .min(5, errorMessages.minLength('Idea', 5))
    .max(2000, errorMessages.maxLength('Idea', 2000))
    .transform(val => val.trim())
    .refine(val => val.length > 0, {
      message: 'Idea cannot be empty after trimming'
    })
});

/**
 * Answer submission request schema
 */
export const answerSchema = z.object({
  projectId: z.string()
    .uuid(errorMessages.uuid('Project ID')),
  answer: z.string()
    .min(1, errorMessages.required('Answer'))
    .max(5000, errorMessages.maxLength('Answer', 5000))
    .transform(val => val.trim())
});

/**
 * Refinement request schema
 */
export const refineSchema = z.object({
  projectId: z.string()
    .uuid(errorMessages.uuid('Project ID')),
  comments: z.string()
    .min(5, errorMessages.minLength('Comments', 5))
    .max(3000, errorMessages.maxLength('Comments', 3000))
    .transform(val => val.trim())
});

/**
 * Project ID parameter schema
 */
export const projectIdParamSchema = z.object({
  id: z.string()
    .uuid(errorMessages.uuid('Project ID'))
});

/**
 * Health check response schema
 */
export const healthCheckSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string().datetime(),
  version: z.string(),
  uptime: z.number().optional(),
  memory: z.object({
    used: z.number(),
    total: z.number()
  }).optional()
});

// Type exports
export type InitProjectInput = z.infer<typeof initProjectSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type RefineInput = z.infer<typeof refineSchema>;
export type ProjectIdParam = z.infer<typeof projectIdParamSchema>;
