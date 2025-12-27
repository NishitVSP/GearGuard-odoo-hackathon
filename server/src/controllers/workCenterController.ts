import { Request, Response, NextFunction } from 'express';
import workCenterService, { CreateWorkCenterDTO, UpdateWorkCenterDTO } from '../services/workCenterService';

export class WorkCenterController {
  /**
   * Get all work centers
   * GET /api/work-centers?includeUtilization=true
   */
  async getAllWorkCenters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeUtilization = req.query.includeUtilization === 'true';
      const workCenters = await workCenterService.getAllWorkCenters(includeUtilization);

      res.status(200).json({
        status: 'success',
        data: workCenters,
        meta: {
          count: workCenters.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single work center by ID
   * GET /api/work-centers/:id
   */
  async getWorkCenterById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid work center ID',
        });
        return;
      }

      const workCenter = await workCenterService.getWorkCenterById(id);

      if (!workCenter) {
        res.status(404).json({
          status: 'error',
          message: 'Work center not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: workCenter,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new work center
   * POST /api/work-centers
   */
  async createWorkCenter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateWorkCenterDTO = req.body;

      // Validate required fields
      if (!data.name || !data.code || !data.category) {
        res.status(400).json({
          status: 'error',
          message: 'Missing required fields: name, code, category',
        });
        return;
      }

      const workCenter = await workCenterService.createWorkCenter(data);

      res.status(201).json({
        status: 'success',
        data: workCenter,
        message: 'Work center created successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          status: 'error',
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Update a work center
   * PUT /api/work-centers/:id
   */
  async updateWorkCenter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid work center ID',
        });
        return;
      }

      const data: UpdateWorkCenterDTO = req.body;
      const workCenter = await workCenterService.updateWorkCenter(id, data);

      res.status(200).json({
        status: 'success',
        data: workCenter,
        message: 'Work center updated successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Work center not found') {
          res.status(404).json({
            status: 'error',
            message: error.message,
          });
          return;
        }
        if (error.message.includes('already exists')) {
          res.status(409).json({
            status: 'error',
            message: error.message,
          });
          return;
        }
      }
      next(error);
    }
  }

  /**
   * Delete a work center
   * DELETE /api/work-centers/:id
   */
  async deleteWorkCenter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid work center ID',
        });
        return;
      }

      await workCenterService.deleteWorkCenter(id);

      res.status(200).json({
        status: 'success',
        message: 'Work center deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Work center not found') {
        res.status(404).json({
          status: 'error',
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }
}

export default new WorkCenterController();
