# TaskMaster - Backend

Este es el repositorio del backend para la aplicación **TaskMaster**, encargada de gestionar la lógica de negocio relacionada con la creación, actualización, eliminación y obtención de tareas y sus detalles.

## Características

- API RESTful para la gestión de tareas.
- Soporte para autenticación mediante tokens JWT.
- Endpoints para mover tareas entre estados.
- Historial de tareas completadas y eliminadas.
- Gestión de tareas favoritas.
- Gestión de detalles específicos de cada tarea.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework para la creación de APIs RESTful.
- **PostgreSQL**: Base de datos SQL para almacenar las tareas y sus detalles.
- **Sequelize**: ORM para la interacción con PostgreSQL.
- **JSON Web Tokens (JWT)**: Para la autenticación de usuarios.
- **bcryptjs**: Para el cifrado de contraseñas.

## Endpoints Principales

- POST /login: Inicia sesión y devuelve un token JWT.
- POST /register: Registra un nuevo usuario.
- GET /tasks: Obtiene todas las tareas.
- POST /tasks: Crea una nueva tarea.
- PUT /tasks/:id: Actualiza una tarea específica.
- DELETE /tasks/:id: Elimina una tarea.
- GET /tasks/history: Obtiene el historial de tareas completadas.
- GET /tasks/:id/details: Obtiene los detalles de una tarea específica.
- POST /tasks/:id/details: Agrega detalles a una tarea.

## Estructura del Proyecto

- auth/: Contiene el auth.js, ruta para el registro de usuarios, valida los datos de entrada, verifica si el correo ya existe, y crea un nuevo usuario con una contraseña encriptada.
- middleware/: Contiene authMiddleware.js, para validar el token JWT en las solicitudes.
- task/: Contiene los modelos de Task, TaskHistory y TaskDetail. Ademas de los endpoints para gestionar el CRUD de las Tareas
- user/: Contiene el modelo de User, y los endpoint para el CRUD de usuarios 

## Contribuciones

Las contribuciones son bienvenidas.
