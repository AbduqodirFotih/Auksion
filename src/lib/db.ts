import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

declare global {
  var _sqliteDb: DatabaseType | undefined;
}

const dbPath = path.resolve(process.cwd(), 'auction_final.db');

let db: DatabaseType;

if (process.env.NODE_ENV === 'production') {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
} else {
  if (!global._sqliteDb) {
    global._sqliteDb = new Database(dbPath);
    global._sqliteDb.pragma('journal_mode = WAL');
  }
  db = global._sqliteDb;
}

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS plates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT UNIQUE NOT NULL,
      regionCode TEXT NOT NULL,
      startingPrice TEXT NOT NULL,
      currentPrice TEXT NOT NULL,
      endTime INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS bids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plateId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      amount TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY(plateId) REFERENCES plates(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  const adminExists = db.prepare('SELECT id FROM users WHERE name = ?').get('admin');
  if (!adminExists) {
    db.prepare(`INSERT INTO users (name, role) VALUES ('admin', 'admin')`).run();
  }

  const platesCount = db.prepare('SELECT COUNT(*) as count FROM plates').get() as {count: number};
  if (platesCount.count === 0) {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    const insertPlate = db.prepare(`
      INSERT INTO plates (number, regionCode, startingPrice, currentPrice, endTime)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertPlate.run('777 AA', '01', '5000000', '5000000', now + sevenDays);
    insertPlate.run('222 BB', '10', '3000000', '3000000', now + sevenDays);
    insertPlate.run('001 VIP', '01', '10000000', '10000000', now + sevenDays);
  }
};

initDB();

export default db;
