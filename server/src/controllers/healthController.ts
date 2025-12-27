import { Request, Response, NextFunction } from 'express';
import { getPool } from '../config/database';
import { config } from '../config/env';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    memory: {
      total: number;
      used: number;
      percentage: number;
    };
  };
}

export class HealthController {
  /**
   * Comprehensive health check endpoint
   */
  static async healthCheck(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check database connectivity
      let dbStatus: 'up' | 'down' = 'down';
      let dbResponseTime: number | undefined;
      let dbError: string | undefined;
      
      try {
        const pool = getPool();
        const dbStart = Date.now();
        await pool.query('SELECT 1');
        dbResponseTime = Date.now() - dbStart;
        dbStatus = 'up';
      } catch (error: any) {
        dbError = error.message;
      }
      
      // Memory usage
      const memoryUsage = process.memoryUsage();
      const totalMemory = memoryUsage.heapTotal;
      const usedMemory = memoryUsage.heapUsed;
      const memoryPercentage = (usedMemory / totalMemory) * 100;
      
      // Determine overall health status
      let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (dbStatus === 'down') {
        overallStatus = 'unhealthy';
      } else if (memoryPercentage > 90 || (dbResponseTime && dbResponseTime > 1000)) {
        overallStatus = 'degraded';
      }
      
      const result: HealthCheckResult = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: config.env,
        services: {
          database: {
            status: dbStatus,
            responseTime: dbResponseTime,
            error: dbError,
          },
          memory: {
            total: Math.round(totalMemory / 1024 / 1024), // MB
            used: Math.round(usedMemory / 1024 / 1024), // MB
            percentage: Math.round(memoryPercentage),
          },
        },
      };
      
      const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
      
      res.status(statusCode).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Simple ping endpoint
   */
  static ping(_req: Request, res: Response): void {
    res.json({
      status: 'success',
      message: 'pong',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get system information
   */
  static systemInfo(_req: Request, res: Response): void {
    res.json({
      status: 'success',
      data: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        env: config.env,
        uptime: process.uptime(),
        memoryUsage: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        },
      },
    });
  }
}
