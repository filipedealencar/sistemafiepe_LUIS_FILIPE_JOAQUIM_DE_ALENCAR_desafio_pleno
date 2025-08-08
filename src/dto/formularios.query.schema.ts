import { z } from 'zod';

export const FormulariosQuerySchema = z.object({
  nome: z.string().optional(),
  schema_version: z
    .string()
    .regex(/^\d+$/, { message: "O campo 'schema_version' deve ser um número inteiro." })
    .transform(Number)
    .optional(),
  pagina: z
    .string()
    .regex(/^\d+$/, { message: "O campo 'pagina' deve ser um número inteiro." })
    .transform(Number)
    .default(1),
  tamanho_pagina: z
    .string()
    .regex(/^\d+$/, { message: "O campo 'tamanho_pagina' deve ser um número inteiro." })
    .transform(Number)
    .default(20)
    .refine((val) => val <= 100, {
      message: 'O parâmetro tamanho_pagina deve ser menor ou igual a 100.',
    }),
  ordenar_por: z
    .string()
    .optional()
    .refine((val) => !val || ['nome', 'criado_em'].includes(val), {
      message: "O campo 'ordenar_por' deve ser um dos valores permitidos: nome, criado_em.",
    }),
  ordem: z
    .string()
    .optional()
    .refine((val) => !val || ['asc', 'desc'].includes(val), {
      message: "O campo 'ordem' deve ser um dos valores permitidos: asc, desc.",
    }),
});

export type FormulariosQuery = z.infer<typeof FormulariosQuerySchema>;
