const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
const db = require('./config/db');

async function testDB() {
  const [rows] = await db.query('SELECT 1');
  console.log('✅ DB is Connected');
}

testDB();

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  console.log(`The server has started to ${port}`);
});
