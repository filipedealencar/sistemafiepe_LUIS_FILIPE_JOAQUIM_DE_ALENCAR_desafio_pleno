import { z } from "zod";

const CampoSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "ID do campo deve ser alfanumérico e sem espaços"
    ),
  label: z.string().min(1, "Label é obrigatório"),
  tipo: z.enum(["text", "number", "boolean", "date", "select", "calculated"]),
  obrigatorio: z.boolean().optional().default(false),
  propriedades: z.record(z.string(), z.any()).optional(),
});

export const FormularioSchema = z.object({
  nome: z.string().min(1).max(255),
  descricao: z.string().max(500).optional(),
  campos: z.array(CampoSchema).min(1).max(100),
});

export type FormularioInput = z.infer<typeof FormularioSchema>;
