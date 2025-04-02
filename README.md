# Reusable UI

<img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&style=flat-square">
<img src="https://img.shields.io/badge/-Typescript-007ACC.svg?logo=typescript&style=flat-square">
<img src="https://img.shields.io/badge/-Python-3776AB.svg?logo=python&style=flat-square">
<img src="https://img.shields.io/badge/-Docker-1488C6.svg?logo=docker&style=flat-square">

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