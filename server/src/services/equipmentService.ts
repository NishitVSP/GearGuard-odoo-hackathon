import { getPool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface EquipmentFilters {
  search: string;
  category: string;
  status: string;
  page: number;
  limit: number;
}

interface Equipment {
  id: number;
  name: string;
  equipment_code: string;
  category_id: number;
  category_name?: string;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  location?: string;
  status: string;
  assigned_team_id?: number;
  description?: string;
  specifications?: any;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface CreateEquipmentDto {
  name: string;
  equipment_code: string;
  category_id: number;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  location?: string;
  status?: string;
  assigned_team_id?: number;
  description?: string;
  specifications?: any;
  image_url?: string;
}

export class EquipmentService {
  /**
   * Get all equipment with filters
   */
  async getAllEquipment(filters: EquipmentFilters): Promise<any> {
    const { search, category, status, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        e.*,
        ec.name as category_name,
        mt.name as team_name,
        d.name as department_name,
        COUNT(DISTINCT mr.id) as open_requests
      FROM equipment e
      LEFT JOIN equipment_categories ec ON e.category_id = ec.id
      LEFT JOIN maintenance_teams mt ON e.assigned_team_id = mt.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN maintenance_requests mr ON e.id = mr.equipment_id 
        AND mr.stage IN ('new', 'in_progress', 'assigned')
      WHERE 1=1
    `;
    
    const params: any[] = [];

    if (search) {
      query += ` AND (e.name LIKE ? OR e.equipment_code LIKE ? OR e.serial_number LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (category) {
      query += ` AND ec.name = ?`;
      params.push(category);
    }

    if (status) {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    query += ` GROUP BY e.id ORDER BY e.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await getPool().query<RowDataPacket[]>(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT e.id) as total 
      FROM equipment e 
      LEFT JOIN equipment_categories ec ON e.category_id = ec.id
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (search) {
      countQuery += ` AND (e.name LIKE ? OR e.equipment_code LIKE ? OR e.serial_number LIKE ?)`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (category) {
      countQuery += ` AND ec.name = ?`;
      countParams.push(category);
    }

    if (status) {
      countQuery += ` AND e.status = ?`;
      countParams.push(status);
    }

    const [countRows] = await getPool().query<RowDataPacket[]>(countQuery, countParams);
    const total = countRows[0].total;

    return {
      items: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get equipment by ID with detailed information
   */
  async getEquipmentById(id: number): Promise<any> {
    const query = `
      SELECT 
        e.*,
        ec.name as category_name,
        mt.name as team_name,
        d.name as department_name
      FROM equipment e
      LEFT JOIN equipment_categories ec ON e.category_id = ec.id
      LEFT JOIN maintenance_teams mt ON e.assigned_team_id = mt.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = ?
    `;

    const [rows] = await getPool().query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    const equipment = rows[0];

    // Get maintenance requests for this equipment
    const requestsQuery = `
      SELECT 
        mr.*,
        u.name as technician_name
      FROM maintenance_requests mr
      LEFT JOIN users u ON mr.assigned_technician_id = u.id
      WHERE mr.equipment_id = ?
      ORDER BY mr.created_at DESC
      LIMIT 20
    `;

    const [requests] = await getPool().query<RowDataPacket[]>(requestsQuery, [id]);

    return {
      ...equipment,
      maintenance_requests: requests,
    };
  }

  /**
   * Create new equipment
   */
  async createEquipment(data: CreateEquipmentDto): Promise<Equipment> {
    const {
      name,
      equipment_code,
      category_id,
      model,
      manufacturer,
      serial_number,
      purchase_date,
      warranty_expiry_date,
      location,
      status = 'operational',
      assigned_team_id,
      description,
      specifications,
      image_url,
    } = data;

    const query = `
      INSERT INTO equipment (
        name, equipment_code, category_id, model, manufacturer, serial_number,
        purchase_date, warranty_expiry_date, location, status, assigned_team_id,
        description, specifications, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await getPool().query<ResultSetHeader>(query, [
      name,
      equipment_code,
      category_id,
      model || null,
      manufacturer || null,
      serial_number || null,
      purchase_date || null,
      warranty_expiry_date || null,
      location || null,
      status,
      assigned_team_id || null,
      description || null,
      specifications ? JSON.stringify(specifications) : null,
      image_url || null,
    ]);

    const newEquipment = await this.getEquipmentById(result.insertId);
    return newEquipment;
  }

  /**
   * Update equipment
   */
  async updateEquipment(id: number, data: Partial<CreateEquipmentDto>): Promise<Equipment | null> {
    const allowedFields = [
      'name', 'equipment_code', 'category_id', 'model', 'manufacturer',
      'serial_number', 'purchase_date', 'warranty_expiry_date', 'location',
      'status', 'assigned_team_id', 'description', 'specifications', 'image_url'
    ];

    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        if (key === 'specifications' && data[key as keyof CreateEquipmentDto]) {
          values.push(JSON.stringify(data[key as keyof CreateEquipmentDto]));
        } else {
          values.push(data[key as keyof CreateEquipmentDto]);
        }
      }
    });

    if (updates.length === 0) {
      return this.getEquipmentById(id);
    }

    values.push(id);

    const query = `UPDATE equipment SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await getPool().query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.getEquipmentById(id);
  }

  /**
   * Delete equipment
   */
  async deleteEquipment(id: number): Promise<boolean> {
    const query = `DELETE FROM equipment WHERE id = ?`;
    const [result] = await getPool().query<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Get all equipment categories
   */
  async getCategories(): Promise<any[]> {
    const query = `SELECT id, name FROM equipment_categories WHERE is_active = TRUE ORDER BY name`;
    const [rows] = await getPool().query<RowDataPacket[]>(query);
    return rows;
  }
}

export default new EquipmentService();
