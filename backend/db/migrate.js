/**
 * MoroVerse — DB Migration Runner
 */

require('dotenv').config({ path: '../.env' });
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db, pool } = require('./index');
const path = require('path');

(async () => {
    console.log('🌙 Running MoroVerse DB migrations…');
    try {
        await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
        console.log('✅ Migrations complete!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await pool.end();
    }
})();
