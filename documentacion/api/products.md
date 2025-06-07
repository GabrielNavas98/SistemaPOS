Esto nos permite:

🧩 Mostrar productos en el frontend (POS)

✏️ Administrarlos (crear, editar, eliminar lógicamente)

🔄 Asociarlos con categorías

🔒 Proteger estas rutas con JWT para que solo usuarios autorizados accedan


| Método   | Ruta                | Descripción              |
| -------- | ------------------- | ------------------------ |
| `GET`    | `/api/products`     | Listar productos activos |
| `POST`   | `/api/products`     | Crear un nuevo producto  |
| `PUT`    | `/api/products/:id` | Editar un producto       |
| `DELETE` | `/api/products/:id` | Eliminación lógica       |
