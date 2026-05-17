# EventHub

EventHub is a production-ready Event Management System. It allows organizers to seamlessly create and manage events, and provides attendees with an intuitive platform to securely book their spots.

##  Features

### Core Capabilities
- **Role-Based Access Control**: Secure experiences tailored for `USER` (Attendees), `ORGANIZER` (Hosts), and `ADMIN` (System Administrators).
- **Event Lifecycle Management**: Organizers submit events which are held as `PENDING`. Admins approve them for publication.
- **Smart Booking**: Transaction-safe booking system prevents overbooking of limited capacity events. Past events are automatically marked as `COMPLETED`.
- **Interactive Profile Management**: Seamlessly manage account settings, profile details, and security preferences directly from the dashboard sidebar.

### Technical Architecture
- **Frontend**: Lightweight, blazing-fast Vanilla JavaScript and CSS with Glassmorphism UI. Uses modern `fetch` API for asynchronous data loading.
- **Backend**: Robust Java Spring Boot RESTful API.
- **Security**: JWT (JSON Web Token) stateless authentication, BCrypt password hashing, and Spring Security filters.
- **Database**: MySQL with Hibernate ORM, utilizing optimized JPA relationships (`@ManyToOne`, `@OneToMany`) and query indexing.
- **Robust Error Handling**: Global `@ControllerAdvice` guarantees clean, standardized JSON API responses.

---

##  Getting Started

### Prerequisites
- **Java 11+** installed
- **Maven** installed (or use the provided `./mvnw` wrapper)
- **MySQL 8.0+** running locally
- A modern Web Browser (Chrome, Firefox, Edge)

### Database Setup
1. Open MySQL and create the database:
   ```sql
   CREATE DATABASE eventhub_db;
   ```
2. The application is configured to connect with:
   - **URL:** `jdbc:mysql://localhost:3306/eventhub_db`
   - **Username:** `root`
   - **Password:** `root9876` *(Update this in `backend/src/main/resources/application.properties` if your MySQL credentials differ)*.

### Running the Backend
1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The server will start on `http://localhost:8080`.*

### Running the Frontend
Because the frontend uses vanilla HTML/JS/CSS, no Node.js server is required! 
1. Open the root folder of the project in VS Code.
2. Navigate to the `frontend/` folder.
3. Use the **Live Server** extension to serve `frontend/index.html`.
   *Alternatively, just double-click `frontend/index.html` to open it in your browser.*

---

##  Folder Structure

```text
EventHub/
│
├── backend/                  # Java Spring Boot Application
│   ├── src/main/java/.../
│   │   ├── config/           # CORS & App configurations
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Standardized API Request/Response objects
│   │   ├── exception/        # Global Error Handling
│   │   ├── model/            # JPA Entities (Database Tables)
│   │   ├── repository/       # Spring Data JPA interfaces
│   │   ├── security/         # JWT Utils, Filters, and BCrypt Config
│   │   └── service/          # Business Logic & Transactions
│   └── src/main/resources/   # application.properties
│
├── frontend/                 # Frontend Application
│   ├── css/                  # Global Styles & Glassmorphism UI
│   ├── js/                   # Frontend Logic (api.js, dashboard.js, auth.js)
│   ├── index.html            # Landing Page & Auth Modals
│   └── dashboard.html        # Dynamic User/Organizer/Admin Portal
```

---

## Default Admin Account
To create your first Admin account, simply click "Sign Up" on the frontend and select the `System Administrator` role. You can then approve events created by Organizers.

---

## Documentation & Help

If you need more detailed instructions on how to use the platform as a User, Organizer, or Administrator, please refer to our [Help & Support Guide](help.md). It contains step-by-step guides and a Frequently Asked Questions (FAQ) section.
