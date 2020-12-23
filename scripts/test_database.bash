#!/bin/bash

echo "Prueba"

# echo "Create database"
# docker-compose run postgres createdb app  -U test
# echo "Add postgis extension"
# docker-compose run postgres psql -d app -U app -c "CREATE EXTENSION postgis;CREATE EXTENSION postgis_topology;"


export PGPASSWORD=test

echo "Create database"
# createdb app  -U test -h localhost 
# psql -c "CREATE DATABASE app" "user=test dbname=test password=test host=postgres"
psql -d $DEFAULTDATABASE -U $USERNAME -h $HOST -p $PORT -c "CREATE DATABASE $NEWDATABASE" 
echo "Add postgis extension"
psql -d $NEWDATABASE -U $USERNAME -h $HOST -p $PORT -c "CREATE EXTENSION postgis;CREATE EXTENSION postgis_topology;"