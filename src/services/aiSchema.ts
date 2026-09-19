import { z } from 'zod';

export const RequirementSchema = z.object({
  id: z.number().int().positive(),
  text: z.string(),
  verdict: z.enum(['Pass', 'Partial', 'Fail']),
  confidence: z.number().min(0).max(100),
  evidence: z.string(),
  test: z.string(),
});

export const VerdictSchema = z.object({
  overall_verdict: z.enum(['Pass', 'Partial', 'Fail']),
  confidence: z.number().min(0).max(100),
  summary: z.string(),
  requirements: z.array(RequirementSchema).min(1),
});

export type VerdictData = z.infer<typeof VerdictSchema>;

