import { Request, Response, NextFunction } from 'express';
import equipmentService from '../services/equipmentService';

export class EquipmentController {
  /**
   * Get all equipment with filtering and search
   * GET /api/equipment?search=&category=&status=&page=1&limit=10
   */
  async getAllEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        search = '',
        category = '',
        status = '',
        page = '1',
        limit = '100',
      } = req.query;

      const equipment = await equipmentService.getAllEquipment({
        search: search as string,
        category: category as string,
        status: status as string,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      res.status(200).json({
        status: 'success',
        data: equipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get equipment by ID
   * GET /api/equipment/:id
   */
  async getEquipmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const equipment = await equipmentService.getEquipmentById(parseInt(id, 10));

      if (!equipment) {
        res.status(404).json({
          status: 'error',
          message: 'Equipment not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: equipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new equipment
   * POST /api/equipment
   */
  async createEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const equipmentData = req.body;
      const newEquipment = await equipmentService.createEquipment(equipmentData);

      res.status(201).json({
        status: 'success',
        message: 'Equipment created successfully',
        data: newEquipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update equipment
   * PUT /api/equipment/:id
   */
  async updateEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const equipmentData = req.body;
      
      const updatedEquipment = await equipmentService.updateEquipment(
        parseInt(id, 10),
        equipmentData
      );

      if (!updatedEquipment) {
        res.status(404).json({
          status: 'error',
          message: 'Equipment not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Equipment updated successfully',
        data: updatedEquipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete equipment
   * DELETE /api/equipment/:id
   */
  async deleteEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await equipmentService.deleteEquipment(parseInt(id, 10));

      if (!deleted) {
        res.status(404).json({
          status: 'error',
          message: 'Equipment not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Equipment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get equipment categories
   * GET /api/equipment/meta/categories
   */
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await equipmentService.getCategories();

      res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EquipmentController();
