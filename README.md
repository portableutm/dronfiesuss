[![Coverage Status](https://coveralls.io/repos/github/portableutm/dronfiesuss/badge.svg?branch=master)](https://coveralls.io/github/portableutm/dronfiesuss?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/portableutm/dronfiesuss)](https://github.com/portableutm/webapp/issues)
[![GitHub license](https://img.shields.io/github/license/portableutm/dronfiesuss)](https://github.com/portableutm/webapp/license)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md) 
 
# What is PortableUTM?
PortableUTM is an ecosystem of products that has a clear objective: provide key actors with a reliable, highly-dependable, standards-compliant UTM solution for airspace management of [Unmanned Aerial Vehicles](https://en.wikipedia.org/wiki/Unmanned_aerial_vehicle), also knowns as RPAs or simply drones. 

As airspace is usually shared between commercial flights and UAVs, our system allows to be used in an ATC environment for supervision of flights while allowing critical situation monitoring and automatic notifications.

Our system is also specially recommended for the usage in emergency disaster response teams and is easy to use for UAV operators to share their telemetry. 

## What is the PortableUTM API?
The API is the main interfaz to interact with UTM data. It supports both the monitoring of all airspace under the control of the authority and the management for pilots and UAV operators of their shared data with authorities and request of new authorizations.

## Dependencies
 * [Node](https://nodejs.org/es/) 
 * [Postgres](https://www.postgresql.org/) 
 * [Postigs](https://postgis.net/)
 * [Docker](https://www.docker.com/) (optional for dev)


## Setup

### .env file
In the repository there is a sample.env file that you should copy and rename to `.env` and modify some parameters:
The `DATABASE_CONNECTION_NAME` indicates which connection to use from those exposed in` ormconfig.json`.
The `JWTSECRET` is used to encrypt the jwt token
The `JWT_EXPIRATION_TIME` is used to determine how long the generated jwt token will last.
The `SMTP_URL`,` SMTP_USERNAME` and `SMTP_PASSWORD` are used to configure the sending of emails with SMTP protocol.

### Deploy
* Download the two repositories: dronfiesuss and webapp.
* If you don’t have npm installed, install npm.
* Run the command “npm install” in both projects.
* Create the database:
* Install PostgreSQL (v11) and PostGIS (v3) on your computer.
* Open pgAdmin.
* Go to your local server, and create a new database called “dev”.
* Restore the script “dronfiesuss/db_scripts/create_empty_db.sql”.
* Open the file “dronfiesuss/ormconfig.json” and set the credentials of your local database.
* Run both projects, using the command “npm start” on the root folder of both projects.

### TL;DR

``` shell
npm install #only first time
docker-compose up
docker-compose run postgres bash /scripts/test_database.bash #only first time
npm run dev
```

### Database configuration
The database used is Postgres with the Postgis extension. This requires having an instance running either locally or externally and configuring it correctly in the `ormconfig.json` file. On the other hand, it is possible to configure the database with Docker. To leave the docker instance running you need to run `docker-compose up`. Also if you want to have an extra exclusive database for tests run the script `docker-compose run postgres bash / scripts / test_database.bash`


### ormconfig.json file
The `ormconfig.json` file details the database configuration parameters. Details of the connections parameters can be obtained on [Connection Options](https://typeorm.io/#/connection-options/what-is-connectionoptions)


## Importants files of root directory
```
docker-compose.yml -> Configuration file for docker-compose
ormconfig.json -> Configuration file for TypeOrm
package.json -> Project configuration file
tsconfig.json -> Configuration file for typeScript
app.ts -> main app file
index.ts -> entry point for app
routes.ts -> Route file to assign controllers to urls
sample.env -> Sample file copy and rename as .env to configure environments files
```

## Importants folders of src
```
config -> Config files
daos -> Daos folder
data -> Entities data used on databaseInit to populate DB for testing 
entities -> Entities folder
middleware -> Middlewares for express (https://expressjs.com/en/guide/writing-middleware.html)
restControllers -> Rest controllers folder
services -> external services
utils -> Various utility files
```

## How to contribute 
To contribute we are accepting pull request, you can follow de [next guide](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

To know more about the roadmap and needs please contact info@dronfies.com

### How to add a new entity and a dao?
To add a new entity and a dao, follow the guidelines of typeorm:
   * https://typeorm.io/#/entities
   * https://typeorm.io/#/working-with-repository

### How to add a new rest controller
 To add a new rest controller you have to add a class that has asynchronous methods that have the parameters `Request`,` Response` and `NextFunction`. In addition, each method in the class must be assigned a route in the `routes.ts` file.
   * add a method `async methodName(request: Request, response: Response, next: NextFunction)`
   * assign a route to the method

```javascript
{
    method: "get", //name of http method
    route: `/operation/creator`, //url
    controller: OperationController, //name of class 
    action: "operationsByCreator", //name of method 
    middlewares: [checkJwt]   // name of needed middleware
}
```

## Key Links
 * [License](LICENSE)
 * [Code of conduct](code_of_conduct.md) 
 * [Testing](test)
