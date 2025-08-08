import { Router } from 'express';
import { RespostasController } from '../controllers/respostas.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validateQuery } from '../middlewares/validateQuery';
import { RespostasQuerySchema } from '../dto/respostas.query.schema';

const router = Router();
const controller = new RespostasController();

/**
 * @swagger
 * tags:
 *   name: Respostas
 *   description: Operações relacionadas às respostas de formulários
 */

/**
 * @swagger
 * /formularios/{id}/respostas:
 *   post:
 *     summary: Envia respostas para um formulário
 *     tags: [Respostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [respostas]
 *             properties:
 *               schema_version:
 *                 type: integer
 *               respostas:
 *                 type: object
 *     responses:
 *       201:
 *         description: Resposta registrada com sucesso
 *       400:
 *         description: Validação falhou
 */
router.post('/:id/respostas', asyncHandler(controller.criar));

/**
 * @swagger
 * /formularios/{id}/respostas:
 *   get:
 *     summary: Lista respostas de um formulário
 *     tags: [Respostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: tamanho_pagina
 *         schema:
 *           type: integer
 *         description: Tamanho da página
 *       - in: query
 *         name: incluir_calculados
 *         schema:
 *           type: boolean
 *         description: Incluir campos calculados no retorno
 *     responses:
 *       200:
 *         description: Lista de respostas retornada com sucesso
 *       404:
 *         description: Formulário não encontrado
 */
router.get('/:id/respostas', validateQuery(RespostasQuerySchema), asyncHandler(controller.listar));

/**
 * @swagger
 * /formularios/{id}/respostas/{id_resposta}:
 *   delete:
 *     summary: Remove logicamente uma resposta
 *     tags: [Respostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id_resposta
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resposta removida com sucesso
 *       404:
 *         description: Resposta ou formulário não encontrado
 *       410:
 *         description: Resposta já removida anteriormente
 *       423:
 *         description: Resposta protegida (bloqueada por políticas de retenção)
 */
router.delete('/:id/respostas/:id_resposta', asyncHandler(controller.remover));

export default router;
