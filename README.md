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
 * [Docker](https://www.docker.com/) (optional for dev)


## Steps to run this project:
To run the project you need install dependencies with `npm install` and you need to have a **postgis** database. The parameters of connection are located on **ormconfig.json**. To simplify the process you can use **docker-compose**. With `docker-compose up` will start the containers. Only the first time you will need cerate the test and install the postgis extension database running the script `docker-compose run postgres bash /scripts/test_database.bash` (it's important that the docker containers are running to run this command). Finally to start the app type `npm start`

``` shell
npm install #only first time
docker-compose up
docker-compose run postgres bash /scripts/test_database.bash #only first time
npm start
```

## Importants files of root directory
```
docker-compose.yml -> Configuration file for docker-compose
entitiesGenerator.ts -> Entities generator from swagger files
ormconfig.json -> Configuration file for TypeOrm
package.json -> Project configuration file
tsconfig.json -> Configuration file for typeScript
app.ts -> main app file
index.ts -> entry point for app
routes.ts -> Route file to assign controllers to urls
```

## Importants folders of src
```
config -> Config files
daos -> Daos folder
data -> Entities data used on databaseInit to populate DB
entities -> Entities folder
middleware -> Middlewares for express (https://expressjs.com/en/guide/writing-middleware.html)
restControllers -> Rest controllers folder
services -> external services
utils -> Various utility files
```


## Key Links:
 * [License](LICENSE)
 * [Code of conduct](code_of_conduct.md) 
 
