# Casos de prueba

| ID | Caso de prueba | Resultado esperado | Estado |
|---|---|---|---|
| CP-01 | Acceso a la landing page | La página principal carga correctamente | Aprovado |
| CP-02 | Acceso al login | El formulario de login se muestra correctamente | Aprovado, requiere revisión ingreso lento la primera vez |
| CP-03 | Login incorrecto | El sistema muestra mensaje de error | Se muestra correctamente el mensaje "Credenciales invalidas" |
| CP-04 | Login correcto | El usuario es redirigido al dashboard | Aprovado el usuario es redirigido al dashboard |
| CP-05 | Protección de rutas | Sin sesión no se puede acceder al dashboard | Aprovado el usuario es redirigido a la pestaña login si intenta acceder mediante las rutas /dashboard |
| CP-06 | Conexión a la base de datos | Se recuperan denuncias desde PostgreSQL | Aprovado conexión establecida, datos recuperados correctamente |
| CP-07 | Visualización de denuncias | La tabla muestra las denuncias correctamente | Visualización correcta de denuncias  |
| CP-08 | Visualización de gráficos | Los gráficos estadísticos cargan correctamente | Visualización correcta de los graficos |

---