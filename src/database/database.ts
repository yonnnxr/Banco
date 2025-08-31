import mysql from 'mysql2/promise'
import { config } from '../config'

const pool = mysql.createPool({
    host: config.DB_HOST || 'localhost',
    user: config.DB_USER || 'root',
    password: config.DB_PASSWORD || '',
    database: config.DB_NAME || 'banco',
    port: parseInt(config.DB_PORT || '3306'),
    socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
});

export default pool;
