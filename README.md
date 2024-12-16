# Collaborative Drawing App


Collaborative Drawing App built using the MERN (MongoDB, Express.js, React.js, Node.js) stack with real-time collaboration features enabled through Socket.IO. It allows users to create, collaborate, and share whiteboards in real-time with other users.

## Features

- **User Signup/Login:** Users can create an account or login to their existing account.
- **Whiteboard Creation:** Users can create new whiteboards which are saved in the MongoDB database and displayed on the user's dashboard.
- **Unique Whiteboard Links:** Each whiteboard has a unique ID and is opened on a unique link.
- **Real-time Collaboration:** Live sessions are started when the owner is present on the whiteboard page. Multiple users can collaborate and draw simultaneously in real-time.
  
## Tech Stack

- **MongoDB**: Used for storing user data and whiteboard progress.
- **Express.js**: Handles HTTP requests and routing.
- **React.js**: Frontend library for building user interfaces.
- **Node.js**: Backend environment for running server-side code.
- **Socket.IO**: Enables real-time, bidirectional communication between clients and server.
- **JWT Authentication**: For user authentication and authorization.
