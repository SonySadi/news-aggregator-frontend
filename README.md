# News Aggregator Frontend

This is the frontend project for a news aggregator application.

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn
- Docker and Docker Compose (optional, for containerized setup)

### Environment Setup

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the following variables in the `.env` file:
   - `NEXT_PUBLIC_API_URL`: Set this to your backend URL if different from the default.
   - `PORT`: Set this to change the port the application runs on (default is 3000).

### Running the Project

#### Local Development

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) (or your custom port) in your browser to see the application.

#### Using Docker

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000) (or your custom port).

4. To stop the containers:

   ```bash
   docker-compose down
   ```

## Development

- The project uses hot-reloading. Any changes you make to the source files will be reflected in the running application without needing to restart the server or rebuild the Docker image.

## Deployment

For deployment options, refer to the documentation of your chosen hosting platform.
