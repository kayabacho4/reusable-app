# Reusable App
This is a SNS style application built with React (TypeScript), Fast API, and MySQL, running in Docker containers. It was created for personal use.

## Features

* Authentication
* User registration
* Text posting
* Post deletion
* User profile updates

## Prerequisites

* Docker
* Docker Compose

## Getting Started

### Build

Run the following command in an environment with Docker and Docker Compose installed:

```bash
docker compose build
```

### Run

Start containers with:

```bash
docker compose up
```

Once all containers are up and running, you can access the application at:
http://localhost:5173/