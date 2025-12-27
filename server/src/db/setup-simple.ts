import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import { config } from '../config/env';

async function setupSimplifiedDatabase() {
  let connection: mysql.Connection | null = null;

  try {
    console.log('\n🚀 GearGuard Simplified Database Setup\n');
    console.log('========================================\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      multipleStatements: true,
    });

    console.log('✅ Connected to MySQL server\n');

    // Read and execute simplified schema
    console.log('📦 Creating simplified database schema...');
    const schemaPath = path.join(__dirname, 'migrations', '000_simplified_schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');
    
    await connection.query(schemaSql);
    console.log('✅ Database and tables created\n');

    // Use the database
    await connection.query(`USE ${config.database.database}`);

    // Read and execute seed data
    console.log('🌱 Seeding initial data...');
    const seedPath = path.join(__dirname, 'seeds', '000_simplified_seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf-8');
    
    await connection.query(seedSql);
    console.log('✅ Seed data inserted\n');

    // Verify setup
    console.log('🔍 Verifying database setup...\n');
    
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Created ${(tables as any[]).length} tables:`);
    (tables as any[]).forEach((table: any, index: number) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    console.log('');

    // Show data counts
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [equipmentCount] = await connection.query('SELECT COUNT(*) as count FROM equipment');
    const [requestCount] = await connection.query('SELECT COUNT(*) as count FROM maintenance_requests');
    const [teamCount] = await connection.query('SELECT COUNT(*) as count FROM maintenance_teams');

    console.log('📊 Data Summary:');
    console.log(`   Users: ${(userCount as any)[0].count}`);
    console.log(`   Teams: ${(teamCount as any)[0].count}`);
    console.log(`   Equipment: ${(equipmentCount as any)[0].count}`);
    console.log(`   Maintenance Requests: ${(requestCount as any)[0].count}\n`);

    console.log('========================================\n');
    console.log('✅ Simplified database setup complete!\n');
    console.log('📚 Key Features:');
    console.log('   - 8 focused tables (vs 30+ in complex version)');
    console.log('   - Supports all hackathon requirements');
    console.log('   - Equipment tracking by department & employee');
    console.log('   - Maintenance teams & technicians');
    console.log('   - Corrective & preventive requests');
    console.log('   - Request workflow (New → In Progress → Repaired → Scrap)');
    console.log('   - Calendar & Kanban view support');
    console.log('   - Smart button queries ready\n');

    console.log('🎯 Default Login:');
    console.log('   Email: admin@gearguard.com');
    console.log('   Password: admin123\n');

    console.log('📖 Documentation:');
    console.log('   DATABASE_SIMPLIFIED.md - Complete schema docs\n');

    console.log('🚀 Next Steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Start frontend: cd ../client && npm run dev');
    console.log('   3. Build features for hackathon!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup failed!\n');
    console.error('Error:', error);
    console.error('\nTroubleshooting:');
    console.error('  1. Check if MySQL is running');
    console.error('  2. Verify .env configuration');
    console.error('  3. Check MySQL user permissions\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupSimplifiedDatabase();
