# Quick-Notes

CRUD creado con React, TailwindCSS y MongoDB.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API](#api)
- [Contribuciones](#contribuciones)
- [Contacto](#contacto)

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

### Prerrequisitos

- Node.js
- npm (Node Package Manager)
- MongoDB (debe estar instalado y corriendo)

### Clonar el Repositorio

\```bash
git clone https://github.com/JandresLuna/Quick-Notes.git
cd Quick-Notes
\```

### Instalar Dependencias

\```bash
npm install
\```

## Configuración

1. **Configura MongoDB:**

   - Asegúrate de que MongoDB esté instalado y ejecutándose en tu máquina.
   - Crea una base de datos en MongoDB para el proyecto.

2. **Archivo de Configuración `config.json`:**

   Crea un archivo `config.json` en el directorio raíz del proyecto con el siguiente formato:

   \```json
   {
     "mongoURI": "mongodb+srv://<usuario>:<clave>@cluster0.mongodb.net/<tu-base-de-datos>?retryWrites=true&w=majority",
     "jwtSecret": "<tu-secret>",
     "port": 3000
   }
   \```

   - Reemplaza `<usuario>` y `<clave>` con tus credenciales de MongoDB.
   - Reemplaza `<tu-base-de-datos>` con el nombre de tu base de datos.
   - Ajusta el `port` según sea necesario (el valor por defecto es `3000`).

3. **Configuración de Postman:**

   - Utiliza el archivo `config.json` para obtener tu URI de MongoDB y JWT Secret.
   - Configura los entornos de Postman para realizar solicitudes con los tokens de acceso adecuados.
   - Asegúrate de actualizar las variables de entorno de Postman con la URL de tu servidor y el token de acceso JWT.

## Uso

### Iniciar el Servidor

\```bash
npm start
\```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación en el navegador.

### Ejecución en Desarrollo

\```bash
npm run dev
\```

Esto utilizará nodemon para reiniciar automáticamente el servidor en caso de cambios en el código.

## API

Las siguientes rutas están disponibles para interactuar con el backend:

- `GET /api/notes` - Obtiene todas las notas
- `POST /api/notes` - Crea una nueva nota
- `GET /api/notes/:id` - Obtiene una nota por ID
- `PUT /api/notes/:id` - Actualiza una nota por ID
- `DELETE /api/notes/:id` - Elimina una nota por ID

### Ejemplo de Solicitud con Postman

\```http
POST /api/notes
Content-Type: application/json
Authorization: Bearer <tu-access-token>

{
  "title": "Nueva Nota",
  "content": "Contenido de la nota"
}
\```

## Contribuciones

¡Las contribuciones son bienvenidas! Sigue estos pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-feature`).
3. Realiza tus cambios y haz un commit (`git commit -am 'Añadir nueva feature'`).
4. Empuja la rama (`git push origin feature/nueva-feature`).
5. Abre un Pull Request.


## Contacto


Enlace del Proyecto: [https://github.com/JandresLuna/Quick-Notes](https://github.com/JandresLuna/Quick-Notes)

