import * as dotenv from 'dotenv';
dotenv.config();

import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

async function exportSqlDump() {
  const dbUrlStr = process.env.DATABASE_URL;
  if (!dbUrlStr) {
    console.error('ERROR: DATABASE_URL not set in .env');
    process.exit(1);
  }

  console.log('Connecting to database...');
  
  const connection = await mysql.createConnection({
    uri: dbUrlStr,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Ensure standard MySQL quotes
  await connection.query(`SET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO';`);

  console.log('Connected! Fetching database schema and table list...');

  const [tablesResult] = await connection.query<mysql.RowDataPacket[]>('SHOW TABLES;');
  const tableKey = Object.keys(tablesResult[0])[0];
  const tables = tablesResult.map((row) => row[tableKey]);

  console.log(`Found ${tables.length} tables:`, tables.join(', '));

  let dumpContent = `-- Gujarat Post MySQL Database Dump\n`;
  dumpContent += `-- Generated: ${new Date().toISOString()}\n`;
  dumpContent += `-- Database: defaultdb\n\n`;
  dumpContent += `SET FOREIGN_KEY_CHECKS=0;\n`;
  dumpContent += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
  dumpContent += `SET time_zone = "+00:00";\n\n`;

  for (const table of tables) {
    console.log(`Exporting table: ${table}...`);
    dumpContent += `-- --------------------------------------------------------\n`;
    dumpContent += `-- Table structure for table \`${table}\`\n`;
    dumpContent += `-- --------------------------------------------------------\n`;
    dumpContent += `DROP TABLE IF EXISTS \`${table}\`;\n`;

    const [createTableResult] = await connection.query<mysql.RowDataPacket[]>(`SHOW CREATE TABLE \`${table}\`;`);
    let createTableSql = createTableResult[0]['Create Table'];
    
    // Replace double-quoted column/table names with backticks for universal MySQL compatibility
    createTableSql = createTableSql.replace(/"([^"]+)"/g, '`$1`');

    dumpContent += `${createTableSql};\n\n`;

    const [rows] = await connection.query<mysql.RowDataPacket[]>(`SELECT * FROM \`${table}\`;`);
    if (rows.length > 0) {
      dumpContent += `-- Dumping data for table \`${table}\` (${rows.length} rows)\n`;
      const columns = Object.keys(rows[0]).map((col) => `\`${col}\``).join(', ');
      
      const valueStrings: string[] = [];
      for (const row of rows) {
        const vals = Object.values(row).map((val) => {
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number' || typeof val === 'boolean') return val;
          if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
          if (Buffer.isBuffer(val)) return `X'${val.toString('hex')}'`;
          return mysql.escape(val);
        });
        valueStrings.push(`(${vals.join(', ')})`);
      }

      // Chunk inserts in batches of 50
      for (let i = 0; i < valueStrings.length; i += 50) {
        const batch = valueStrings.slice(i, i + 50);
        dumpContent += `INSERT INTO \`${table}\` (${columns}) VALUES\n${batch.join(',\n')};\n`;
      }
      dumpContent += `\n`;
    }
  }

  dumpContent += `SET FOREIGN_KEY_CHECKS=1;\n`;

  const backendDumpPath = path.join(process.cwd(), 'gujaratpost_database_dump.sql');
  const rootDumpPath = path.join(process.cwd(), '..', 'gujaratpost_database_dump.sql');

  fs.writeFileSync(backendDumpPath, dumpContent, 'utf-8');
  fs.writeFileSync(rootDumpPath, dumpContent, 'utf-8');

  console.log(`Successfully created MySQL dump file!`);
  console.log(`Saved at: ${backendDumpPath}`);
  console.log(`Saved at: ${rootDumpPath}`);

  await connection.end();
}

exportSqlDump().catch((err) => {
  console.error('Error exporting MySQL dump:', err);
  process.exit(1);
});
