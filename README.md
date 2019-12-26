# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm install` command
1. Run `docker-compose up` command (Optional, its possible use your own postgres instance, config params in *ormconfig.json* )
1. Run `docker-compose run postgres bash /scripts/test_database.bash` To init testing database
1. Run `npm start` command



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
db -> Entities to init database
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