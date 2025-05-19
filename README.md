API hosted on https://bitespeed-task-o4vn.onrender.com/identify

Postman testing can be done at this endpoint

To run the service on a development environment

use the following commands 

git clone https://github.com/AdarshChandra42/bitespeed-task

npm install

npm install nodemon -D

create a new database using
CREATE DATABASE database_name;

to connect to the database, run the command in root of directory
psql -U user_name -d database_name -f schema.sql

npm run dev
