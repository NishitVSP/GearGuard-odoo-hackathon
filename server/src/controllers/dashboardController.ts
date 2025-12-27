import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboardService';

export class DashboardController {
  /**
   * Get dashboard statistics with trends
   * GET /api/dashboard/stats
   */
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getDashboardStats();
      
      res.status(200).json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get recent maintenance requests
   * GET /api/dashboard/recent-requests?limit=5
   */
  async getRecentRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      
      const requests = await dashboardService.getRecentRequests(limit);
      
      res.status(200).json({
        status: 'success',
        data: requests,
        meta: {
          count: requests.length,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get upcoming scheduled maintenance
   * GET /api/dashboard/upcoming-maintenance?limit=5
   */
  async getUpcomingMaintenance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      
      const maintenance = await dashboardService.getUpcomingMaintenance(limit);
      
      res.status(200).json({
        status: 'success',
        data: maintenance,
        meta: {
          count: maintenance.length,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
