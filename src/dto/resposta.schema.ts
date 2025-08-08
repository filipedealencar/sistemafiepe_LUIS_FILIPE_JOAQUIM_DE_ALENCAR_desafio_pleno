import { z } from 'zod';

export const RespostaSchema = z.object({
  schema_version: z.number().optional(),
  respostas: z.record(z.string(), z.any()).refine((obj) => Object.keys(obj).length > 0, {
    message: "O objeto 'respostas' não pode estar vazio.",
  }),
});

export type RespostaInput = z.infer<typeof RespostaSchema>;
