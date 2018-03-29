# Technical interview : Decentralized booking system

A decentralized booking system that allow two concurrent firms to trustlessly share their room booking agendas.

## Getting Started

To run the service, clone the repo and run the following commands.

```
cd app/
docker-compose up --build
```

To access the service, go on your browser and connect to localhost/

### Prerequisites

You need to have nodejs and npm installed.

```
sudo apt-get install -y nodejs
```

### Installing

To get started and the web app, you only need to install have docker and docker-compose.
The application in its current state is packaged to be deployed. Nonetheless, you can quickly setup a dev environment with the following steps :

* Delete the COPY command on the Dockerfile.app file
* Change the rm service in the docker-compose.yml as following

```
rm:
  build:
    context: ./
    dockerfile: ./Dockerfile.app
  volumes:
    - .:/app/
  ports:
    - "80:80"
  volumes:
    - ./:/app
  links:
    - db
  tty: true
```  

* Enter the app container with the command

```
docker exec -it app_rm_1 bash
```

* Run the following commands in the /app folder

```
npm install
gulp
```

After completing these steps, every changes you make on your local files will be reflected in the container, and thus on the webapp.
You can then connect to localhost/ on your browser to access the service.


To get started on the contracts, you need to install the truffle suite, ganache-cli as well as Metamask extension for your web browser.


```
npm install truffle
npm install ganache-cli
```


## Running the tests

Only the contracts have tests.
You can run them with the following steps :

* In a terminal, run an ganache-cli instance with

```
ganache-cli -l 10000000
```

* In another terminal, in the contracts/ folder where truffle in installed, run

```
truffle test
```

## Deployment

The project has been developed as a demo, there is no production web server (like nginx or apache) configured. The app is server directly by the flask development web server.

## Built With

* [Flask](http://www.http://flask.pocoo.org/) - Back-end
* [React](https://reactjs.org/) - Front-end
* [Gulp](https://gulpjs.com/) - Building and bundling
* [Docker](https://www.docker.com/) - Container shipping
* [Truffle](http://www.http://truffleframework.com/) - Framework for smart contract development
