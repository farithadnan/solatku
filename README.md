<h1 align="center">
  <br>
  <a href="https://github.com/farithadnan/solatku"><img alt="Solatku's Logo" src="./src/assets/mosque-logo.svg" width="200"></a>
  <br>
  <b>Solatku</b>
  <br>
</h1>

<p align="center">
<b>Solatku</b> is a web application designed <b>to help Malaysian users know the prayer times of the day</b>. Users can choose their location, and the app will fetch the accurate prayer times based on <b>JAKIM</b>'s data using <a href="https://github.com/mptwaktusolat/api-waktusolat">api-waktusolat API</a>. 

<blockquote>
The motivation behind creating <b>Solatku</b> was to improve my Angular skills, learn how to use <a href="https://taiga-ui.dev/getting-started">Taiga UI</a>, understand how to dockerize an Angular app, and learn how to enhance performance by using <b>Nginx</b> and <b>Gzip</b> for handling static files.
</blockquote>
</p>

## ✨ Features

- Accurate prayer times based on **JAKIM**'s data
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

To run the app using **multi-stage Docker**, simply run either the `update.bat` or `update.sh` script, you can find these script in the root directory of the project's folder.

On Windows:

```sh
update.bat
```

On Linux/Mac:

```sh
./update.sh
```

**Ensure Docker is installed and running** on your machine before executing these scripts.

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](/LICENSE) file for details.

## 🙏Acknowledgements

Article, API and resources that help me throughout the development:

- [api-waktusolat](https://github.com/mptwaktusolat/api-waktusolat) - is used for fetching prayer times data.
- [Taiga Ui](https://taiga-ui.dev/getting-started) - is used as the UI framework for the app.
- [Nginx Cache for Dockerized Angular App](https://zakimohammed.medium.com/nginx-cache-config-for-dockerized-angular-app-ngdocker-58e58f965c7).
- [Improve performance with Gzip](https://codeomelet.com/posts/gzip-dockerized-angular-app-with-nginx-ngdocker).
- [How to dockerize Angular's app](https://wkrzywiec.medium.com/build-and-run-angular-application-in-a-docker-container-b65dbbc50be8).
- [Multi-stage Docker](https://docs.docker.com/build/building/multi-stage/).
- [Adding PWA to Angular app](https://dev.to/rodrigokamada/adding-the-progressive-web-application-pwa-to-an-angular-application-4g1e).
- [How to deploy an Angular app with Vercel](https://medium.com/@lara.delrio333/deploy-an-angular-project-in-vercel-with-secret-environment-variables-74323925712d).
