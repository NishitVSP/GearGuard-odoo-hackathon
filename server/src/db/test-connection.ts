// C:\Users\Lenovo\Desktop\programming\gearguard\server\src\db\migrator.ts
import { getPool } from '../config/database';

async function testDatabaseConnection() {
  console.log('🧪 Testing GearGuard Database Connection\n');
  console.log('========================================\n');

  try {
    // Test 1: Connection Pool
    console.log('1️⃣ Testing connection pool...');
    const pool = getPool();
    const connection = await pool.getConnection();
    console.log('✅ Connection pool is working\n');
    connection.release();

    // Test 2: Query Execution
    console.log('2️⃣ Testing query execution...');
    const [result] = await pool.query('SELECT VERSION() as version, DATABASE() as current_db');
    console.log(`✅ MySQL Version: ${(result as any)[0].version}`);
    console.log(`✅ Current Database: ${(result as any)[0].current_db || 'None'}\n`);

    // Test 3: Check Tables
    console.log('3️⃣ Checking database tables...');
    const [tables] = await pool.query('SHOW TABLES');
    
    if ((tables as any[]).length === 0) {
      console.log('⚠️  No tables found. Run migrations first: npm run db:setup\n');
    } else {
      console.log(`✅ Found ${(tables as any[]).length} tables:\n`);
      (tables as any[]).forEach((table: any, index: number) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      console.log('');
    }

    // Test 4: Check Migrations
    try {
      const [migrations] = await pool.query(
        'SELECT COUNT(*) as count FROM schema_migrations'
      );
      console.log(`4️⃣ Migrations executed: ${(migrations as any)[0].count}\n`);
    } catch (error) {
      console.log('4️⃣ Migration table not found (run migrations first)\n');
    }

    // Test 5: Sample Data Check
    try {
      const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
      const [equipment] = await pool.query('SELECT COUNT(*) as count FROM equipment');
      const [requests] = await pool.query('SELECT COUNT(*) as count FROM maintenance_requests');
      
      console.log('5️⃣ Data Summary:');
      console.log(`   Users: ${(users as any)[0].count}`);
      console.log(`   Equipment: ${(equipment as any)[0].count}`);
      console.log(`   Maintenance Requests: ${(requests as any)[0].count}\n`);
    } catch (error) {
      console.log('5️⃣ Tables not yet created (run migrations first)\n');
    }

    console.log('========================================');
    console.log('✅ All tests passed!\n');
    console.log('Next steps:');
    console.log('  1. Run migrations: npm run db:setup');
    console.log('  2. Start dev server: npm run dev');
    console.log('  3. Check MySQL Workbench for visual confirmation\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection test failed!\n');
    console.error('Error:', error);
    console.error('\nTroubleshooting:');
    console.error('  1. Check if MySQL is running');
    console.error('  2. Verify .env configuration');
    console.error('  3. Test connection in MySQL Workbench');
    console.error('  4. Check MySQL user permissions\n');
    process.exit(1);
  }
}

testDatabaseConnection();
