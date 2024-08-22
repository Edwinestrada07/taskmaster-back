import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Usa la URL de conexión proporcionada por Supabase desde las variables de entorno
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
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
  });

export default sequelize;
