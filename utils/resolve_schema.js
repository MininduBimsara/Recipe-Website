const fs = require('fs');
const path = require('path');

function resolveSchema() {
  const envPath = path.join(__dirname, '../.env.local');
  const schemaPath = path.join(__dirname, '../supabase_schema.sql');
  const outputPath = path.join(__dirname, '../supabase_schema_resolved.sql');

  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found at ' + envPath);
    process.exit(1);
  }

  if (!fs.existsSync(schemaPath)) {
    console.error('Error: supabase_schema.sql file not found at ' + schemaPath);
    process.exit(1);
  }

  // 1. Read .env.local and find ADMIN_USER_ID
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/ADMIN_USER_ID\s*=\s*([a-fA-F0-9-]{36})/);
  
  if (!match) {
    console.error('Error: ADMIN_USER_ID was not found or is not a valid UUID in .env.local.');
    process.exit(1);
  }

  const adminUserId = match[1];
  console.log(`[Schema Resolver] Found ADMIN_USER_ID in .env.local: ${adminUserId}`);

  // 2. Read base schema
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Default hardcoded UUID in supabase_schema.sql to replace
  const defaultAdminId = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7';

  // 3. Replace all occurrences
  const resolvedContent = schemaContent.replace(new RegExp(defaultAdminId, 'g'), adminUserId);

  // 4. Write output file
  fs.writeFileSync(outputPath, resolvedContent, 'utf8');
  console.log(`[Schema Resolver] Successfully wrote resolved schema to: ${outputPath}`);
  console.log('\n==================================================================');
  console.log('You can now copy the contents of supabase_schema_resolved.sql');
  console.log('and run it in your Supabase SQL editor to enable RLS secure access!');
  console.log('==================================================================\n');
}

resolveSchema();
