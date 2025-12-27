import { getPool } from '../config/database';
import fs from 'fs';
import path from 'path';

/**
 * Complete database setup script
 * Runs all migrations in order to create/update the database schema
 */
async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
  
  // Get all migration files in order
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Files are numbered, so alphabetical sort works
  
  console.log(`Found ${migrationFiles.length} migration files:\n`);
  migrationFiles.forEach((file, idx) => {
    console.log(`  ${idx + 1}. ${file}`);
  });
  console.log('');
  
  const pool = getPool();
  
  try {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`📝 Running migration: ${file}`);
      
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && s !== '');
      
      for (const statement of statements) {
        try {
          // Skip comments and empty lines
          if (statement.trim().startsWith('--') || !statement.trim()) {
            continue;
          }
          
          await pool.query(statement);
        } catch (error: any) {
          // Ignore "already exists" errors for idempotency
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
              error.code === 'ER_DB_CREATE_EXISTS' ||
              error.code === 'ER_DUP_KEYNAME' ||
              error.code === 'ER_DUP_ENTRY') {
            console.log(`  ⚠️  Skipped (already exists)`);
            continue;
          }
          throw error;
        }
      }
      
      console.log(`  ✅ Completed successfully\n`);
    }
    
    console.log('✨ Database setup completed successfully!\n');
    
    // Verify tables were created
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`📊 Total tables in database: ${(tables as any[]).length}`);
    console.log('\nTables:');
    (tables as any[]).forEach((table: any) => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    throw error;
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run setup if executed directly
if (require.main === module) {
  setupDatabase().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default setupDatabase;
