# Finance Backend API
 
A REST API backend for a finance dashboard system with role-based access control.
 
## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs
- express-rate-limit
- Helmet.js
- Jest
 
## Setup
 
1. Clone the project
```
git clone https://github.com/kalanig23/finance-backend.git
```
2. Enter into Folder
```
cd finance-backend
```
3.  install Dependencies
```
npm install
```
4. `.env` file banao
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```
5. start Server 
```
nodemon index.js
```
6. run Tests
```
npm test
```
 
## Project Structure
```
finance-backend/
├── controllers/
│   ├── auth.js
│   ├── record.js
│   ├── user.js
│   └── dashboard.js
├── config/
│   └── db.js
├── middleware/
│   ├── auth.js
│   ├── role.js
│   └── validate.js
├── models/
│   ├── User.js
│   └── Record.js
├── routes/
│   ├── auth.js
│   ├── records.js
│   ├── users.js
│   └── dashboard.js
├── tests/
│   ├── auth.test.js
│   ├── records.test.js
│   ├── users.test.js
│   └── dashboard.test.js
├── .env
├── .gitignore
├── index.js
└── README.md
```
 
## Roles
| Role | Permissions |
|------|------------|
| admin | Full access — users, records, dashboard |
| analyst | View + create + update records, dashboard |
| viewer | Only view records and dashboard |
 
## API Endpoints
 
### Auth
| Method | URL | Body | Description |
|--------|-----|------|-------------|
| POST | /api/auth/register | name, email, password, role | Register user |
| POST | /api/auth/login | email, password | Login user |
 
### Records
| Method | URL | Description | Role |
|--------|-----|-------------|------|
| POST | /api/records | Create record | admin, analyst |
| GET | /api/records | Get all records | all |
| GET | /api/records?page=1&limit=10 | Pagination | all |
| GET | /api/records?search=salary | Search by notes | all |
| GET | /api/records?type=income | Filter by type | all |
| GET | /api/records?category=food | Filter by category | all |
| GET | /api/records?startDate=2024-01-01&endDate=2024-12-31 | Filter by date | all |
| GET | /api/records/:id | Get one record | all |
| PUT | /api/records/:id | Update record | admin, analyst |
| DELETE | /api/records/:id | Soft delete record | admin |
 
### Users
| Method | URL | Description | Role |
|--------|-----|-------------|------|
| GET | /api/users | Get all users | admin |
| GET | /api/users/:id | Get one user | admin |
| PUT | /api/users/:id/role | Update role | admin |
| PUT | /api/users/:id/status | Update status | admin |
 
### Dashboard
| Method | URL | Description | Role |
|--------|-----|-------------|------|
| GET | /api/dashboard/summary | Total income, expense, balance | all |
| GET | /api/dashboard/monthly | Monthly trends | all |
| GET | /api/dashboard/categories | Category wise totals | all |
 
## Features
- JWT token based authentication
- Role based access control (admin, analyst, viewer)
- MVC pattern — controllers and routes separate
- Input validation with useful error messages
- Pagination support
- Search support
- Soft delete (records are not permanently deleted)
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Unit tests (Jest)
 
## How Authentication Works
1. Register  — `/api/auth/register`
2. Login  — `/api/auth/login` — token milega
3. send token on each request:
```
Authorization: Bearer YOUR_TOKEN_HERE
```
 
## Assumptions
- Admin can register any role during registration
- Viewer can only view records and dashboard, cannot create or modify
- JWT token expires in 7 days
- Soft delete — isDeleted flag uses, data not permanently delete
- Rate limit — 100 requests per 15 minutes per IP
- Password must minimum 6 characters
