# VozSegura

VozSegura es una plataforma web reducida para colegios que permite visualizar denuncias anonimas relacionadas con bullying, acoso u otros problemas escolares. La recepcion de denuncias se preparara para integrarse mas adelante con un chatbot de Telegram; por ahora el proyecto incluye un webhook placeholder y un endpoint interno para registrar denuncias.

## Tecnologias usadas

- Next.js con App Router
- TypeScript estricto
- Tailwind CSS
- PostgreSQL mediante `DATABASE_URL`
- [`postgres`](https://www.npmjs.com/package/postgres) para la conexion a base de datos
- [`recharts`](https://recharts.org/) para graficos
- [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) para validacion de contrasenas
- [`jose`](https://www.npmjs.com/package/jose) para JWT
- Cookies `httpOnly` para autenticacion
- Vercel para despliegue

## Estructura del proyecto

```text
vozsegura/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── .gitignore
├── .env.example
├── postcss.config.js
├── sql/
│   └── schema.sql
├── public/
│   └── logo.svg
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── login/
    │   │   └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   └── api/
    │       ├── health/
    │       │   └── route.ts
    │       ├── auth/
    │       │   ├── login/
    │       │   │   └── route.ts
    │       │   ├── logout/
    │       │   │   └── route.ts
    │       │   └── me/
    │       │       └── route.ts
    │       ├── denuncias/
    │       │   └── route.ts
    │       └── telegram/
    │           └── webhook/
    │               └── route.ts
    ├── components/
    │   ├── Navbar.tsx
    │   ├── LoginForm.tsx
    │   ├── DashboardCard.tsx
    │   ├── DenunciasTable.tsx
    │   └── DenunciasCharts.tsx
    ├── lib/
    │   ├── db.ts
    │   ├── auth.ts
    │   └── utils.ts
    ├── services/
    │   └── denuncias.service.ts
    └── types/
        ├── denuncia.ts
        └── usuario.ts
```

## Variables de entorno

Crear un archivo `.env.local` a partir de `.env.example`:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/database"
AUTH_SECRET="cambia_este_valor_por_un_secreto_seguro"
TELEGRAM_BOT_TOKEN="pendiente_para_integracion_futura"
```

Notas:

- `DATABASE_URL` y `AUTH_SECRET` solo se usan en el servidor.
- No se debe usar `NEXT_PUBLIC_` para secretos.

## Instalacion local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Crea `.env.local` con los valores reales de Nhost PostgreSQL y un secreto seguro.
3. Inicia el entorno de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000).

## Configuracion de conexion a Nhost PostgreSQL

1. En Nhost, copia la cadena de conexion PostgreSQL.
2. Asignala a `DATABASE_URL` en `.env.local`.
3. Asegurate de que la base de datos ya contenga las tablas `usuario` y `denuncia` con la estructura documentada en `sql/schema.sql`.
4. Verifica que el usuario administrativo tenga la columna `contrasena` almacenada como hash bcrypt.

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura las variables `DATABASE_URL`, `AUTH_SECRET` y `TELEGRAM_BOT_TOKEN` en el panel de Vercel.
4. Despliega la aplicacion.

La app esta preparada para ejecutarse como proyecto full-stack en Vercel usando rutas API y acceso a PostgreSQL desde el servidor.

## Rutas principales

- `/`: landing page informativa
- `/login`: acceso administrativo
- `/dashboard`: panel protegido con resumen, graficos y tabla de denuncias
- `/api/health`: estado basico del servicio
- `/api/auth/login`: login con usuario y contrasena
- `/api/auth/logout`: cierre de sesion
- `/api/auth/me`: sesion actual
- `/api/denuncias`: consulta y registro de denuncias
- `/api/telegram/webhook`: placeholder para futura integracion con Telegram

## Seguridad

- No guardar ni comparar contrasenas en texto plano.
- La columna `contrasena` debe contener hashes bcrypt.
- La sesion se almacena en una cookie `httpOnly` firmada con JWT.

## Nota sobre Telegram

La integracion con el bot de Telegram no esta implementada todavia. El proyecto deja lista una ruta placeholder para conectar el webhook en una fase posterior sin cambiar la arquitectura principal.
