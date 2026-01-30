# Young Adults Backend

NestJS backend with MongoDB for Young Adults educational center.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/young-adults
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret-change-this
REFRESH_TOKEN_EXPIRES_IN=30d

# Default Admin User (created automatically on first startup if not exists)
DEFAULT_ADMIN_EMAIL=admin@gmail.com
DEFAULT_ADMIN_PASSWORD=@dm1n
DEFAULT_ADMIN_NAME=Admin User
DEFAULT_ADMIN_PHONE=+998901234567
```

3. Make sure MongoDB is running

4. Start development server (default admin user will be created automatically if not exists):
```bash
npm run start:dev
```

Default admin credentials (from `.env`):
- Email: `admin@gmail.com` (or `DEFAULT_ADMIN_EMAIL`)
- Password: `@dm1n` (or `DEFAULT_ADMIN_PASSWORD`)

5. Start development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (admin/moderator only)
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

- `GET /api/users` - Get all users (admin/moderator)
- `POST /api/users` - Create user (admin/moderator)
- `GET /api/courses` - Get all courses (public)
- `POST /api/courses` - Create course (moderator/admin)
- `GET /api/teachers/:id/courses` - Get teacher courses
- `GET /api/teachers/:id/students` - Get teacher students
- `POST /api/students/:id/grade` - Grade student (teacher)

And more... See Swagger docs for full API documentation.

## Roles

- `admin` - Full access
- `moderator` - Can manage courses, services, employees, etc.
- `teacher` - Can view assigned courses and grade students
