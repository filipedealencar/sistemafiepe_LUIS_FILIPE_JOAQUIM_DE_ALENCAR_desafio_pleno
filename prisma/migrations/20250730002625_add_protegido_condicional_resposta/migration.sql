-- AlterTable
ALTER TABLE "public"."Campo" ADD COLUMN     "condicional" TEXT;

-- AlterTable
ALTER TABLE "public"."Formulario" ADD COLUMN     "protegido" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."Resposta" (
    "id" TEXT NOT NULL,
    "formularioId" TEXT NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "respostas" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAtivo" BOOLEAN NOT NULL DEFAULT true,
    "dataRemocao" TIMESTAMP(3),
    "usuarioRemocao" TEXT,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Resposta" ADD CONSTRAINT "Resposta_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "public"."Formulario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
