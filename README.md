
IntraNet Portal – Project Setup Guide
The IntraNet Portal is a comprehensive web application designed for educational institutions. It is built using a React-based frontend and a Node.js + Express backend, with MongoDB used for data storage. The application is designed to support three types of users—students, teachers, and administrators—each with tailored dashboards and specific access privileges.

To get started with this project, ensure that Node.js, npm, and MongoDB are installed on your system. The project folder is organized into two main directories: one for the backend server (backend) and one for the React frontend (front). MongoDB should be running locally on your machine at the default URL mongodb://127.0.0.1:27017/intranetPortal.

To run the backend, open your terminal and navigate to the backend folder. Run npm install to install all dependencies. You can start the backend server in development mode using the command npm run dev, which will enable auto-reload for faster development. If you prefer running it in production mode, simply use npm start. Once the server is running, it will be accessible at http://localhost:5000.

Next, to run the frontend, navigate to the front directory. Run npm install to install frontend dependencies, then use npm start to launch the React development server. The frontend will be available at http://localhost:3000. Make sure that the backend is running before launching the frontend, as the frontend relies on it for data through API calls.

The portal provides role-based access to its users. Students can view and interact with clubs, book time slots, register complaints, explore available courses, and more. Teachers have access to functionalities such as viewing their class schedules and submitting or receiving feedback. Admins have full access to the system, allowing them to manage clubs, users, courses, complaints, announcements, events, food menus, and other core features of the portal.

From a technical perspective, the backend provides RESTful API routes to handle various modules such as authentication, user management, club and course handling, event and announcement publishing, feedback, and complaints. All these APIs are defined and managed within the main backend server file (server.js). On the frontend, the application uses React Router for role-based navigation and presents users with intuitive dashboards based on their login credentials. Each dashboard is designed to ensure clarity and ease of use, with forms and features built for responsiveness and accessibility.

If you'd like to see how the project works in action, a complete demo video is available. You can watch it at the following YouTube playlist link: Project Demo Video. This video will guide you through the portal’s major features and show how different user roles interact with the system.

Please note that while making any UI or design improvements, it is important not to change the core logic that handles the connection between frontend and backend, or between the different user roles such as student and admin. This ensures system integrity and avoids unintended bugs or access issues.
