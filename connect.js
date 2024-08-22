import Sequelize from 'sequelize';

// Usa la URL de conexión proporcionada por Supabase desde las variables de entorno
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Deshabilitar la verificación SSL
        }
    },
    logging: false // Opcional: desactiva el log de Sequelize para mayor limpieza
});

// Conexión a la base de datos por medio de Sequelize
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

export default sequelize;


