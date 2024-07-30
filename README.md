# video-streaming-app api

This is the backend api for the video streaming app, implemented as part of my project.

## Technology Stacks:
 Nodejs v16
 Express
 Typescript
 AWS S3 and cloudfront
 Multer
 Mongodb and mongoose
 Json Web Token (jwt)

1. ## Node.js v16:
   I have utilized Node.js v16 as the runtime environment for the project. It serves as the backbone for running server-side JavaScript code efficiently.

2. ## Express:
   Express framework has been employed to build the web application and API endpoints. Its robust features streamline handling HTTP requests, routing, and middleware integration.

3. ## TypeScript:
   TypeScript has been chosen to enhance code maintainability and productivity. By adding static typing to JavaScript, it helps catch errors during development. The codebase is written in TypeScript and compiles down to JavaScript for execution.

4. ## AWS S3 and CloudFront:
   For file storage and content delivery, I have integrated AWS S3 and CloudFront into the project. AWS S3 is utilized to store and retrieve uploaded files, while CloudFront accelerates content delivery by caching it at edge locations.

5. ## Multer:
   Multer middleware has been implemented to handle file uploads in the project. It simplifies the process of validating and storing multipart/form-data, seamlessly integrating with Express.js.

6. ## MongoDB and Mongoose:
   MongoDB, a NoSQL database, is the primary data store for the project. I have used Mongoose, an ODM library, to interact with MongoDB and simplify tasks such as schema validation, querying, and data manipulation.

7. ## JSON Web Token (JWT):
   JWTs are utilized for authentication and authorization purposes in the project. I have implemented JWT-based authentication to secure API endpoints and manage user sessions effectively.

These technologies collectively contribute to the functionality and architecture of the project, enabling features such as file uploads, user authentication, and seamless data storage and retrieval.

## Installation and run locally:

1. Clone the video-streaming-app repository
```video-streaming-app.git```
2. Navigate to the directory where you cloned the project to
3. Run ```npm install``` to install node modules and packages
4. Rename .env.example to .env, and set your local environment variables
5. Start and run the application locally.
```npm run dev```
6. Test the apis through postman:

## Endpoints:
### Testing the api through postman:
1. Create a user: 
```javascript
  Post: http://localhost:8100/api/auth/register
  {
    "username": "test.username",
    "email": "test.email@example.com",
    "firstName": "test",
    "middleName": "M",
    "lastName": "user",
    "password": "testpassword"
}
```

2. Login User:
```javascript
  Post: http://localhost:8100/api/auth/login
  {
    "email": "test.user@example.com",
    "password": "testpassword"
  }
```

3. Upload Video:
```javascript
  Post: http://localhost:8100/api/videos/upload

  // you need to set the authorization to perform this action
  {
    "file": "path to upload file",
    "title": "your video title",
    "description": "some description"
  }
```

## Completed and available features:
1. A user is able to register and login to their account
2. An authenticated user is able to upload video files
3. A user is able to load and watch videos uploaded to the system
4. A user is able to comment on a video
5. A user is able to reply to a comment on a video

## Features not implemented:
1. Search is not completed
2. Like, unlike, dislike, follow, subscription are not completed
3. Videos recommendation and related videos is not completed
4. Filtering videos by category is not completed.