// C:\Users\Lenovo\Desktop\programming\gearguard\server\src\db\migrator.ts

import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import { config } from '../config/env';

interface MigrationFile {
  filename: string;
  path: string;
  order: number;
}

export class DatabaseMigrator {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    try {
      // First connect without database to create it if needed
      this.connection = await mysql.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        multipleStatements: true,
      });
      console.log('Connected to MySQL server');
    } catch (error) {
      console.error('Failed to connect to MySQL:', error);
      throw error;
    }
  }

  async createDatabase(): Promise<void> {
    if (!this.connection) throw new Error('No connection established');

    try {
      await this.connection.query(
        `CREATE DATABASE IF NOT EXISTS ${config.database.database} 
         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      console.log(` Database '${config.database.database}' created or already exists`);

      await this.connection.query(`USE ${config.database.database}`);
      console.log(` Using database '${config.database.database}'`);
    } catch (error) {
      console.error(' Failed to create database:', error);
      throw error;
    }
  }

  async createMigrationsTable(): Promise<void> {
    if (!this.connection) throw new Error('No connection established');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_migration_name (migration_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await this.connection.query(createTableSQL);
    console.log('Migrations table ready');
  }

  async getExecutedMigrations(): Promise<string[]> {
    if (!this.connection) throw new Error('No connection established');

    const [rows] = await this.connection.query<any[]>(
      'SELECT migration_name FROM schema_migrations ORDER BY id'
    );

    return rows.map((row) => row.migration_name);
  }

  async getMigrationFiles(): Promise<MigrationFile[]> {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);

    const migrationFiles = files
      .filter((file) => file.endsWith('.sql'))
      .map((file) => {
        const match = file.match(/^(\d+)_(.+)\.sql$/);
        return {
          filename: file,
          path: path.join(migrationsDir, file),
          order: match ? parseInt(match[1], 10) : 0,
        };
      })
      .sort((a, b) => a.order - b.order);

    return migrationFiles;
  }

  async runMigration(migrationFile: MigrationFile): Promise<void> {
    if (!this.connection) throw new Error('No connection established');

    console.log(`\n Running migration: ${migrationFile.filename}`);

    try {
      const sql = await fs.readFile(migrationFile.path, 'utf-8');

      // Split and execute SQL statements
      await this.connection.query(sql);

      // Record migration
      await this.connection.query(
        'INSERT INTO schema_migrations (migration_name) VALUES (?)',
        [migrationFile.filename]
      );

      console.log(` Migration completed: ${migrationFile.filename}`);
    } catch (error) {
      console.error(` Migration failed: ${migrationFile.filename}`, error);
      throw error;
    }
  }

  async runSeedFiles(): Promise<void> {
    if (!this.connection) throw new Error('No connection established');

    const seedsDir = path.join(__dirname, 'seeds');

    try {
      const files = await fs.readdir(seedsDir);
      const seedFiles = files
        .filter((file) => file.endsWith('.sql'))
        .sort();

      for (const file of seedFiles) {
        console.log(`\n Running seed: ${file}`);
        const sql = await fs.readFile(path.join(seedsDir, file), 'utf-8');
        await this.connection.query(sql);
        console.log(` Seed completed: ${file}`);
      }
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        console.log(' No seed files found');
      } else {
        console.error(' Seed execution failed:', error);
        throw error;
      }
    }
  }

  async migrate(runSeeds = false): Promise<void> {
    try {
      await this.connect();
      await this.createDatabase();
      await this.createMigrationsTable();

      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();

      const pendingMigrations = migrationFiles.filter(
        (file) => !executedMigrations.includes(file.filename)
      );

      if (pendingMigrations.length === 0) {
        console.log('\n All migrations are up to date');
      } else {
        console.log(`\n Found ${pendingMigrations.length} pending migration(s)`);

        for (const migration of pendingMigrations) {
          await this.runMigration(migration);
        }

        console.log('\n All migrations completed successfully');
      }

      if (runSeeds) {
        console.log('\n Running seed files...');
        await this.runSeedFiles();
      }
    } catch (error) {
      console.error('\n Migration process failed:', error);
      throw error;
    } finally {
      await this.close();
    }
  }

  async reset(): Promise<void> {
    try {
      await this.connect();

      console.log(`\n Dropping database '${config.database.database}'...`);
      await this.connection!.query(`DROP DATABASE IF EXISTS ${config.database.database}`);
      console.log(' Database dropped');

      await this.createDatabase();
      await this.createMigrationsTable();

      const migrationFiles = await this.getMigrationFiles();

      console.log(`\n Running ${migrationFiles.length} migration(s)...`);
      for (const migration of migrationFiles) {
        await this.runMigration(migration);
      }

      console.log('\n Running seed files...');
      await this.runSeedFiles();

      console.log('\n Database reset completed successfully');
    } catch (error) {
      console.error('\n Database reset failed:', error);
      throw error;
    } finally {
      await this.close();
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('\n Database connection closed');
    }
  }
}

// CLI Runner
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  const command = process.argv[2];

  (async () => {
    try {
      switch (command) {
        case 'migrate':
          await migrator.migrate();
          break;
        case 'seed':
          await migrator.migrate(true);
          break;
        case 'reset':
          await migrator.reset();
          break;
        default:
          console.log(`
GearGuard Database Migrator

Usage:
  npm run db:migrate       - Run pending migrations
  npm run db:seed          - Run migrations and seeds
  npm run db:reset         - Drop database and recreate with migrations and seeds

Current database: ${config.database.database}
Host: ${config.database.host}:${config.database.port}
          `);
      }
      process.exit(0);
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  })();
}
