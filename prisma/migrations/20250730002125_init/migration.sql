-- CreateTable
CREATE TABLE "public"."Formulario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "isAtivo" BOOLEAN NOT NULL DEFAULT true,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRemocao" TIMESTAMP(3),
    "usuarioRemocao" TEXT,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campo" (
    "id" TEXT NOT NULL,
    "campoId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "obrigatorio" BOOLEAN NOT NULL,
    "propriedades" JSONB,
    "formularioId" TEXT NOT NULL,

    CONSTRAINT "Campo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Campo" ADD CONSTRAINT "Campo_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "public"."Formulario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
