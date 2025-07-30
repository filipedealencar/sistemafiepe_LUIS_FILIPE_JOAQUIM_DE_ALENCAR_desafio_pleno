import { z } from "zod";

export const FormulariosQuerySchema = z.object({
  nome: z.string().optional(),
  schema_version: z
    .string()
    .regex(/^\d+$/, "schema_version deve ser um número")
    .transform(Number)
    .optional(),
  pagina: z
    .string()
    .regex(/^\d+$/, "pagina deve ser um número")
    .transform(Number)
    .default(1),
  tamanho_pagina: z
    .string()
    .regex(/^\d+$/, "tamanho_pagina deve ser um número")
    .transform(Number)
    .default(20)
    .refine((val) => val <= 100, {
      message: "O parâmetro tamanho_pagina deve ser menor ou igual a 100.",
    }),
  ordenar_por: z.enum(["nome", "criado_em"]).optional(),
  ordem: z.enum(["asc", "desc"]).optional(),
});

export type FormulariosQuery = z.infer<typeof FormulariosQuerySchema>;
