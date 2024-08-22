import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Convierte `import.meta.url` a un filename y luego a un directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo del certificado intermedio
const sslCertPath = path.resolve(__dirname, './services/SSLcomRSASSLsubCA.crt');

// Lee el certificado desde el archivo
const sslCert = fs.readFileSync(sslCertPath).toString();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      ca: sslCert,  // Incluye el certificado intermedio
    }
  }
});

// Conexión a la base de datos por medio de Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado a la base de datos con éxito.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
    console.error('Detalles del error:', error.original);
  });

export default sequelize;
