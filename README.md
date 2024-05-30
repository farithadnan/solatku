# 🌟 Solatku

**Solatku** is a web application designed to help Malaysian users know the prayer times of the day. Users can choose their location, and the app will fetch the accurate prayer times based on JAKIM's data using [api-waktusolat](https://github.com/mptwaktusolat/api-waktusolat) API.

The motivation behind creating **Solatku** was to improve my Angular skills, learn how to use Taiga UI, understand how to dockerize an Angular app, and learn how to enhance performance by using Nginx and gzip for handling static files.

## ✨ Features

- Accurate prayer times based on JAKIM's data
- Location-based prayer time fetching
- User-friendly  & responsive interface using Taiga UI.

## 📋 Prerequisites

- Node.js and npm
- Angular CLI
- Docker (for running the app using Docker)
- Git

## 🚀 Run using development server

Git clone the repository:

```sh
git clone https://github.com/farithadnan/solatku.git
```

Open the project directory using your IDE, and then run the command below to install dependencies:

```sh
npm install
```

Next, start the development server by running these command:

```sh
npm start
```

## 🐳 Run using Docker

To run the app using multi-stage Docker, simply run either the `update.bat` or `update.sh` script, you can find these script in the root directory of the project's folder.

On Windows:

```sh
update.bat
```

On Linux/Mac:

```sh
./update.sh
```

Ensure Docker is installed and running on your machine before executing these scripts.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏Credits

- [api-waktusolat](https://github.com/mptwaktusolat/api-waktusolat) is used for fetching prayer times data.
