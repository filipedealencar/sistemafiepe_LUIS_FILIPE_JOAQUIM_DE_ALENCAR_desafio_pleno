import { z } from 'zod';

const CampoSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9_]+$/, 'ID do campo deve ser alfanumérico e sem espaços'),
    label: z.string().min(1, 'Label é obrigatório'),
    tipo: z.enum(['text', 'number', 'boolean', 'date', 'select', 'calculated']),
    obrigatorio: z.boolean().optional().default(false),
    propriedades: z.record(z.string(), z.any()).optional(),
    validacoes: z
      .array(
        z.object({
          tipo: z.enum(['minimo', 'maximo', 'regex']),
          valor: z.any(),
        }),
      )
      .optional(),
  })
  .superRefine((campo, ctx) => {
    const min = campo.validacoes?.find((v) => v.tipo === 'minimo');
    const max = campo.validacoes?.find((v) => v.tipo === 'maximo');

    if (min && max && min.valor > max.valor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['validacoes'],
        message: `Valor máximo (${max.valor}) não pode ser menor que o valor mínimo (${min.valor})`,
        params: { campoId: campo.id },
        fatal: true,
      });
      (ctx as any).campoId = campo.id;
    }

    const regexVal = campo.validacoes?.find((v) => v.tipo === 'regex');
    if (regexVal) {
      try {
        new RegExp(regexVal.valor);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['validacoes'],
          message: `Expressão regular inválida: ${regexVal.valor}`,
        });
        (ctx as any).campoId = campo.id;
      }
    }
  });

export const FormularioSchema = z.object({
  nome: z.string().min(1).max(255),
  descricao: z.string().max(500).optional(),
  campos: z.array(CampoSchema).min(1).max(100),
});

export type FormularioInput = z.infer<typeof FormularioSchema>;
