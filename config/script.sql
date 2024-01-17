-- Database: db_transaction

-- DROP DATABASE IF EXISTS db_transaction;

CREATE DATABASE db_transaction
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Peru.1252'
    LC_CTYPE = 'Spanish_Peru.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


create table transaction(
	id varchar,
	amount float,
	currency varchar,
	status varchar,
	created_at timestamp
)

-- Las creendeciales de la base de datos se encuentran en el archivo postgresConn (carpeta config)