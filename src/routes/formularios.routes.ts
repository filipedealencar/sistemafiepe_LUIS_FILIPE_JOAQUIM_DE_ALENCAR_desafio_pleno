import { Router } from 'express';
import { FormulariosController } from '../controllers/formularios.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middlewares/validate';
import { FormularioSchema } from '../dto/formulario.schema';
import { FormulariosQuerySchema } from '../dto/formularios.query.schema';
import { validateQuery } from '../middlewares/validateQuery';

const controller = new FormulariosController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Formulários
 *   description: Operações relacionadas a formulários
 */

/**
 * @swagger
 * /formularios:
 *   post:
 *     summary: Cria um novo formulário dinâmico
 *     tags: [Formulários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, campos]
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               campos:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Formulário criado com sucesso
 *       400:
 *         description: Payload inválido
 *       409:
 *         description: Campo duplicado
 */
router.post('/', validate(FormularioSchema), asyncHandler(controller.create));

/**
 * @swagger
 * /formularios:
 *   get:
 *     summary: Lista formulários com filtros e paginação
 *     tags: [Formulários]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do formulário
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
 *     responses:
 *       200:
 *         description: Lista de formulários retornada com sucesso
 */
router.get('/', validateQuery(FormulariosQuerySchema), asyncHandler(controller.list));

/**
 * @swagger
 * /formularios/{id}:
 *   get:
 *     summary: Obtém detalhes de um formulário específico
 *     tags: [Formulários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulário encontrado
 *       404:
 *         description: Formulário não encontrado
 */
router.get('/:id', asyncHandler(controller.getById));

/**
 * @swagger
 * /formularios/{id}:
 *   delete:
 *     summary: Remove logicamente um formulário
 *     tags: [Formulários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulário removido com sucesso
 *       404:
 *         description: Formulário não encontrado
 *       409:
 *         description: Formulário protegido
 */
router.delete('/:id', asyncHandler(controller.softDelete));

/**
 * @swagger
 * /formularios/{id}/schema_version:
 *   put:
 *     summary: Cria uma nova versão de schema para um formulário
 *     tags: [Formulários]
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
 *             required: [schema_version, campos]
 *             properties:
 *               schema_version:
 *                 type: integer
 *               campos:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Versão atualizada com sucesso
 *       422:
 *         description: Schema inválido ou versão inferior
 */
router.put('/:id/schema_version', asyncHandler(controller.updateSchemaVersion));

export default router;
