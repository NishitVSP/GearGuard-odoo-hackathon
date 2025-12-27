import { getPool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const migrationFile = process.argv[2];
  
  if (!migrationFile) {
    console.error('Usage: ts-node src/scripts/runMigration.ts <migration-file>');
    process.exit(1);
  }

  const migrationPath = path.join(__dirname, '..', 'db', 'migrations', migrationFile);
  
  try {
    console.log(`Reading migration file: ${migrationPath}`);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Connecting to database...');
    const pool = getPool();
    const connection = await pool.getConnection();
    
    console.log('Executing migration...');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await connection.query(statement);
      }
    }
    
    connection.release();
    console.log('✓ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
