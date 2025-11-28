import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from './connection.js';

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'backend','src','db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // Execute the schema
    await query(schema);
    
    console.log('✅ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

