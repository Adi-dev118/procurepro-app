const app = require('./app');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config({ path: './config.env' });

async function testDB() {
  const [rows] = await db.query('SELECT 1');
  console.log('✅ DB is Connected');
}

testDB();

const port = process.env.PORT;
app.listen(port, (err) => {
  console.log(`The server has started to ${port}`);
});
