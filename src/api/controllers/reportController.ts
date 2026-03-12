/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';

import { AppError } from '../../domain/errors/AppError';

//commands, handlers, queries
import { GetReportsByUserQueryHandler } from '../../application/queries/report/GetReportsByUserQueryHandler';
import { GetReportByUserQuery } from '../../application/queries/report/GetReportsByUserQuery';
import { GetReportsForMaintainerQueryHandler } from '../../application/queries/report/GetReportsForMaintainerQueryHandler';
import { GetReportsForMaintainerQuery } from '../../application/queries/report/GetReportsForMaintainerQuery';
import { CreateReportCommandHandler } from '../../application/commands/report/CreateReportCommandHandler';
import { CreateReportCommand } from '../../application/commands/report/CreateReportCommand';

export class ReportController {
    constructor(
        private readonly getReportByUserQueryHandler: GetReportsByUserQueryHandler,
        private readonly getReportForMaintainerQueryHandler: GetReportsForMaintainerQueryHandler,
        private readonly createReportCommandHandler: CreateReportCommandHandler
    ) {}

    async getReportsByUser(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const status = req.query.status as string;
            const priority =
                parseInt(req.query.priority as string) || undefined;

            const result = await this.getReportByUserQueryHandler.handle(
                new GetReportByUserQuery(userId, page, limit, status, priority)
            );
            return res.status(200).json({
                reports: result.reports,
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit),
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }

    async getReportsForMaintainer(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const status = req.query.status as string;
            const priority =
                parseInt(req.query.priority as string) || undefined;
            const managed = (req.query.managed as string) || 'false';

            const result = await this.getReportForMaintainerQueryHandler.handle(
                new GetReportsForMaintainerQuery(
                    userId,
                    page,
                    limit,
                    status,
                    priority,
                    managed
                )
            );
            return res.status(200).json({
                reports: result.reports,
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit),
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }

    async createReport(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { categoryId, title, description, priority } = req.body;

            if (!categoryId || !title || !description || !priority) {
                throw new AppError(
                    400,
                    'Missing required fields',
                    'Minden mező kitöltése kötelező.'
                );
            }

            const report = await this.createReportCommandHandler.handle(
                new CreateReportCommand(
                    userId,
                    categoryId,
                    title,
                    description,
                    priority
                )
            );

            return res.status(201).json({
                messageEn: 'Report created successfully',
                messageHu: 'Hibajegy sikeresen létrehoozva.',
                report: {
                    id: report.id,
                },
            });
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.messageEn,
                    messageHu: error.messageHu,
                });
            }

            return res.status(500).json({
                message: 'Server error',
                err: error.message,
            });
        }
    }
}
