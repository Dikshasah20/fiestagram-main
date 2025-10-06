Fiestagram

Fiestagram is a lightweight, Instagram-style social media application where users can post images, like/comment on posts, follow other users, and browse a feed.

This README describes the features, architecture, setup instructions, and technologies used in Fiestagram (frontend + backend).

Table of Contents

Features

Architecture & Tech Stack

Project Structure

Setup & Installation

Usage

Future Improvements

Contributing

License

Features

User registration, login, and authentication

Create / delete / edit posts (with image upload)

Like and comment on posts

Follow / unfollow users

View feed of posts from followed users

View profiles, see posts by a user

Notifications / activity feed (optional)

Architecture & Tech Stack

Here’s the breakdown of technologies used in Fiestagram:

Frontend

React — UI library for building component-based user interfaces

React Router — for client-side routing / navigation

Redux (or Context API) — for global state management (e.g., user/session, feed data)

Axios (or Fetch API) — for HTTP requests from frontend to backend

Tailwind CSS / SCSS / CSS Modules / Styled Components — for styling and layout

React Dropzone / react-image-upload (or similar) — for handling image upload from client

JWT (token stored in localStorage / cookies) — for maintaining authenticated sessions

Possibly React Query (or SWR) — for server state / data fetching / caching

Backend

Node.js + Express (or similar) — REST API server handling requests

MongoDB (with Mongoose) or PostgreSQL / MySQL — as the database to store users, posts, comments, follows

Cloudinary / AWS S3 / Firebase Storage — for storing image files (uploads)

Multer / Busboy / Formidable — middleware for handling multipart/form-data / file uploads

bcrypt — for password hashing

jsonwebtoken — for issuing and verifying JWTs

CORS — to allow frontend to access backend API

dotenv — to manage environment variables (API keys, database URLs)

Nodemon — for development to auto-restart server on code changes

(Optional) Socket.io / WebSockets — for real-time features like live notifications or live comments

(Optional) cron / agenda / node-cron — for background jobs (clean up, scheduled tasks)

Other / Dev Tools

Git / GitHub — version control, repository hosting

ESLint / Prettier — code linting & formatting

Jest / Mocha / Chai / Supertest — for backend & API testing

React Testing Library / Jest — for frontend component testing

Postman / Insomnia — API testing

Docker (optional) — containerization of backend / database

CI/CD (GitHub Actions, Travis CI, etc.) — automated tests and deployment

Project Structure

Here’s a possible directory structure (you can modify as per your implementation):

fiestagram/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js / server.js
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/ (or context)
│   │   ├── services/ (API calls)
│   │   ├── hooks/
│   │   └── App.js / index.js
│   ├── package.json
│   └── ...
├── README.md
└── .gitignore


backend/ contains all server-side code, routes, models, controllers etc.

frontend/ holds all React (client) code.

Environment-specific config (e.g. .env) is ignored by git (via .gitignore).

Setup & Installation

Here are steps to get the project running locally:

Prerequisites

Node.js (>= 14.x) & npm or yarn

MongoDB (locally or a remote cluster)

Cloudinary account (or AWS S3 / another storage service) for image uploads

Backend Setup

Navigate to backend folder

cd backend


Install dependencies

npm install


Create a .env file — use .env.example as reference. Typical variables:

PORT=5000  
MONGODB_URI=<your_mongo_uri>  
JWT_SECRET=<a strong secret>  
CLOUDINARY_CLOUD_NAME=…  
CLOUDINARY_API_KEY=…  
CLOUDINARY_API_SECRET=…  


Start the backend server

npm run dev   # using nodemon for development  
# or  
npm start     # for production  


The backend API should now be running at http://localhost:5000 (or whatever PORT you specified).

Frontend Setup

Go to frontend folder

cd ../frontend


Install dependencies

npm install


Configure API base URL (in an .env file or in React config) so that frontend knows where to send requests, e.g.:

REACT_APP_API_URL=http://localhost:5000/api


Start the React development server

npm start


You should see the app at http://localhost:3000.

Usage

Register a new user or log in.

Upload posts (with images).

Browse the feed (posts from users you follow).

Like / comment / delete / edit your posts.

Visit user profiles and follow/unfollow users.

(If enabled) Receive notifications for new likes / comments / follows.

Future Improvements

Support video posts / stories

Real-time notifications with WebSockets / Socket.io

Search users / hashtags

Explore page (trending posts)

Direct messaging feature

More secure refresh-token / token rotation

Rate limiting, input validation / sanitization improvements

Full mobile support or native mobile apps

Deployment scripts / CI-CD pipelines

Caching / pagination / performance optimizations

Contributing

Contributions, bug reports, and feature requests are welcome!

Fork the repository

Create your feature branch: git checkout -b feature/name

Commit your changes: git commit -m "Add some feature"

Push to branch: git push origin feature/name

Open a Pull Request

Please ensure you follow the project’s code style (ESLint / Prettier), and add tests if applicable.

License

This project is licensed under the MIT License.
