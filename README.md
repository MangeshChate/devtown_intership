# Task Management Using AWS DynomoDB

Welcome to a simple and efficient task management application.
(devtown)

screen recording of project

https://www.awesomescreenshot.com/video/24409182?key=81c0bd6a1381dc260c500a72fda078fc



## Installation

### Client

To get started with the Devtown client, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/MangeshChate/devtown_intership.git
    ```

2. Navigate to the client directory:

    ```bash
    cd client
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the client:

    ```bash
    npm run dev
    ```

### Backend

To set up the Devtown backend, follow these instructions:

1. Clone the repository:

    ```bash
    git clone https://github.com/MangeshChate/devtown_intership.git
    ```

2. Navigate to the backend directory:

    ```bash
    cd backend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and add the necessary environment variables, including database connection details and JWT secret.

    ```plaintext
    MONGO_URL=your-mongodb-connection-url
    ACCESS_KEY=your-aws-access-key
    SECRET_ACCESS_KEY=your-aws-secret-access-key

    ```

5. Start the backend:

    ```bash
    node index.js
    ```

   

## JSON Web Tokens (JWT)

Devtown uses JSON Web Tokens for secure authentication. JWT is a compact, URL-safe means of representing claims to be transferred between two parties. In this application, JWTs are used to authenticate users and authorize access to protected resources.

### Configuration

Ensure that you set the `JWT_SECRET` environment variable in your backend `.env` file. This secret is used to sign and verify JWTs, providing a secure way to authenticate users.

## DynamoDB Integration

Devtown leverages DynamoDB as its database solution. DynamoDB is a fully managed NoSQL database provided by AWS, offering fast and scalable performance with seamless scalability.

### Configuration

Update your backend `.env` file with DynamoDB connection details:

```plaintext
MONGO_URL=your-mongodb-connection-url
ACCESS_KEY=your-aws-access-key
SECRET_ACCESS_KEY=your-aws-secret-access-key

