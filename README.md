# Dronfies USS api
This is a node project to manage drones operations correctly.


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
```

## Importants folders of src
```
app.ts
config -> Config files
daos -> Daos folder
databaseConfig.ts
databaseInit.ts
data -> Entities data used on databaseInit to populate DB
entities -> Entities folder
index.html 
index.ts
middleware -> Middlewares for express (https://expressjs.com/en/guide/writing-middleware.html)
migration 
restControllers -> Rest controllers folder
routes.ts
services 
subscriber -> Subscribers files for TypeOrm
```


Key Links:
 * [License](LICENSE)
 
