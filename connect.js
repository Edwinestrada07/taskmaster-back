import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Obtén la URL de la base de datos desde las variables de entorno
const databaseUrl = process.env.DATABASE_URL;

// Verificar la URL de la base de datos
console.log('DATABASE_URL:', databaseUrl);

// Verificar si la URL está definida
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

// Crear una instancia de Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  protocol: 'postgres'
});


// Verificar la conexión
const testConnection = async () => {
  try {
    console.log('Attempting to connect to the database...');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

export default sequelize;
