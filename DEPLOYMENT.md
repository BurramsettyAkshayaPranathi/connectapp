# Separate Deployment Guide

This project is now configured so the frontend and backend can be deployed independently.

## Frontend

Deploy the `frontend` folder to a static host such as Vercel or Netlify.

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Required env: `VITE_API_BASE_URL=https://your-backend-domain.com`
- Optional env: `VITE_APP_BASE_PATH=/` unless hosting under a subpath

## Backend

Deploy the `backend` folder to a Java host such as Render or Railway, with a MySQL database.

- Root directory: `backend`
- Build command: `mvn clean package`
- Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- Java version: `17`

Required backend env vars:

```text
DB_URL=jdbc:mysql://<host>:3306/connectapp_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@example.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Deployment order

1. Deploy the backend and copy its public URL.
2. Set `VITE_API_BASE_URL` in the frontend to that backend URL.
3. Deploy the frontend.
4. Add the final frontend URL to the backend `CORS_ALLOWED_ORIGINS`.
5. Redeploy the backend if you changed CORS.
