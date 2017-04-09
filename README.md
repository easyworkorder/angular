# EasyWorkOrder
A work order management system built with python django framework on the backend and Angular2 as the client application. In this readme we will explain about preparing development environment for Angular2 based client application.

# Environment preparation
Download and install Node.js version 7.7.4 from https://nodejs.org/en/ for your operating system.
Then install Angular2 cli using following command
(Assuming npm is in your os path, by default it should be there after installing Node.js)
COMMAND: npm install -g @angular/cli
Now you are ready to build and run angular2 based projects in your computer.


# Downloading/cloning the code
Clone the code from github.com using a command prompt.
Open any of your command prompt and type following command to clone the repository
COMMAND: git clone https://github.com/easyworkorder/angular.git
It will create a directory called `angular` inside that folder all necessary files will be there.

## Preparing the Development server
To run the project your will need to resolve necessary dependencies defined in the package.json file of the project root directory. Run the following commands to resolve dependencies and build/run your project locally.
COMMAND: npm install 
(This will read the package.json file and will install all necessary dependencies in a directory called `node_modules`)
COMMAND: ng build
(This will build the project locally)
COMMAND: ng serve
(This will build the proejct and will open a microservice from there the client application will be browsable. By default it will run in 4200 port and it can be accessed using http://localhost:4200/)
NOTE: To communicate with your local API backend you may need to modify the `angular/src/app/cofig.json` file to change the local port number where you are running your django API backend

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
