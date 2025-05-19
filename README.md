# Bitespeed Backend Task: Identity Reconciliation

This is a backend service that handles contact identification and management.

## Live Demo

The service is hosted at: https://bitespeed-task-o4vn.onrender.com

## API Testing

You can test the API endpoints using Postman at the following URL:
https://bitespeed-task-o4vn.onrender.com/identify

## Local Development Setup

Follow these steps to run the service in your local development environment:

1. Clone the repository:
```bash
git clone https://github.com/AdarshChandra42/bitespeed-task
```

2. Navigate to the project directory:
```bash
cd bitespeed-task
```

3. Install dependencies:
```bash
npm install
```

4. Install development dependencies:
```bash
npm install nodemon -D
```

5. Database Setup:
   - Create a new database:
   ```sql
   CREATE DATABASE database_name;
   ```
   - Connect to the database and run the schema:
   ```bash
   psql -U user_name -d database_name -f schema.sql
   ```

6. Start the development server:
```bash
npm run dev
```

## Environment Variables

Make sure to set up the following environment variables:
- `DATABASE_URL`: Your PostgreSQL database connection string
- `PORT`: The port number for the server (default: 3000)

## API Endpoints

### POST /identify
Identifies and manages contact information based on email and phone number.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Nodemon (for development)
