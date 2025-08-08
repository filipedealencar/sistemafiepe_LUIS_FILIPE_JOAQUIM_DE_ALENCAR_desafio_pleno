import { z } from 'zod';

const ValidacoesSchema = z
  .array(
    z.object({
      tipo: z.string(),
      valor: z.any().optional(),
    }),
  )
  .optional();

const CampoSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, 'ID do campo inválido'),
  label: z.string().min(1).max(255),
  tipo: z.enum(['text', 'number', 'boolean', 'date', 'select', 'calculated']),
  obrigatorio: z.boolean().optional(),
  propriedades: z.record(z.string(), z.any()).optional(),
  dependencias: z.array(z.string()).optional(),
  formula: z.string().optional(),
  validacoes: ValidacoesSchema,
});

export const FormularioVersionSchema = z.object({
  schema_version: z.number().min(1),
  nome: z.string().min(1).max(255),
  descricao: z.string().max(500).optional(),
  campos: z.array(CampoSchema).min(1).max(100),
});

export const SchemaVersionUpdateSchema = z.object({
  schema_version: z.number().min(1),
  descricao: z.string().max(500).optional(),
  campos: z.array(CampoSchema).min(1).max(100),
});

export type FormularioVersionInput = z.infer<typeof FormularioVersionSchema>;

export type SchemaVersionUpdateInput = z.infer<typeof SchemaVersionUpdateSchema>;
