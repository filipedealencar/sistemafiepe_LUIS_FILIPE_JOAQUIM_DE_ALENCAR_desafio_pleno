import { z } from "zod";

export const RespostasQuerySchema = z.object({
  pagina: z.coerce.number().min(1).default(1),
  tamanho_pagina: z.coerce.number().max(100).default(20),
  incluir_calculados: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  schema_version: z.coerce.number().optional(),
});
export type RespostasQuery = z.infer<typeof RespostasQuerySchema>;
