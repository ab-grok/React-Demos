-- 1) ===> Creating a new role (group) with login so it can be used to connect to the database (if needed); role_name here is treated as a group;
CREATE ROLE <role_name> WITH LOGIN PASSWORD '<password>';


-- 2) ===> Granting a role_name to user_role makes user_role a member of role_name, inheriting privileges;
GRANT <role_name> TO <user_role1>, <user_role2>;


-- 3) ===> Change database ownership
ALTER DATABASE <database_name> OWNER TO <role_name>;


-- 3) ===> Change schema ownership
ALTER SCHEMA <schema_name> OWNER TO <role_name>;

 
-- 4) ===> Query to check the ownership of current database;
SELECT pg_get_userbyid(datdba) FROM pg_database WHERE datname = current_database();


-- 5) ===> Query to check the ownership of schemas in the database
SELECT nspname AS schema, pg_get_userbyid(nspowner) AS owner  
        FROM pg_namespace  
        WHERE nspname NOT LIKE 'pg_%' 
        AND nspname <> 'information_schema'
        ORDER BY schema;


-- 6) ===> Query to check the ownership of all tables in database;  
SELECT schemaname, tablename, tableowner 
    FROM pg_tables 
    WHERE schemaname NOT LIKE 'pg_%' 
    AND schemaname <> 'information_schema' 
    ORDER BY schemaname, tablename;


-- 7) ===> Query to transfer ownwership of all schemas in the database to another role;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT nspname  
             FROM pg_namespace
             WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema' -- <> does the same as !=; 
    LOOP
        EXECUTE format('ALTER SCHEMA %I OWNER TO <role_name>', r.nspname); -- format() is used to safely format the SQL command, %I is for identifiers (like schema names) to prevent SQL injection;
    END LOOP; 
END $$;


-- 8) ===> Query to transfer ownership of all tables in the database to another role;
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN SELECT schemaname, tablename 
             FROM pg_tables 
             WHERE schemaname NOT LIKE 'pg_%' 
               AND schemaname <> 'information_schema' 
    LOOP
        EXECUTE format('ALTER TABLE %I.%I OWNER TO <role_name>', r.schemaname, r.tablename);
    END LOOP; 
END $$;


-- 9) ===> Query to grant READ/WRITE access on all tables in all schemas to new role -- not needed if owner;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT nspname
             FROM pg_namespace
             WHERE nspname NOT LIKE 'pg_%' 
               AND nspname <> 'information_schema' 
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA %I TO <role_name>', r.nspname);
    END LOOP; 
END $$;


-- 10) ===> Query to grant USAGE on all sequences in all schemas to new role -- not needed if owner;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT nspname
             FROM pg_namespace
             WHERE nspname NOT LIKE 'pg_%' 
               AND nspname <> 'information_schema' 
    LOOP
        EXECUTE format('GRANT USAGE ON ALL SEQUENCES IN SCHEMA %I TO <role_name>', r.nspname);
    END LOOP; 
END $$;


-- 11) ===> Query to grant READ/WRITE access on all tables added in the future in all schemas to new role -- not needed if owner ;
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT nspname
             FROM pg_namespace
             WHERE nspname NOT LIKE 'pg_%' 
               AND nspname <> 'information_schema' 
    LOOP
        EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO <role_name>', r.nspname);
    END LOOP; 
END $$;


-- 12) ===> A bunch of statements to grant READ/WRITE access on the schema and tables to the new role (not needed if owner);
-- Grant permission to connect to the database
GRANT CONNECT ON DATABASE <database> TO <role_name>;

-- Grant USAGE and CREATE on the schema
GRANT USAGE, CREATE ON SCHEMA <schema> TO <role_name>;

-- Grant SELECT, INSERT, UPDATE, DELETE on all existing tables in the schema
-- Unlike ownership queries which require 'ALTER TABLE', You can 'GRANT' these permissions to all tables in a schema in one go;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema_name> TO <role_name>;

-- Grant SELECT, INSERT, UPDATE, DELETE on all tables added in the future
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema_name> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO <role_name>;

-- Grant USAGE on all sequences in the schema, to allow the role to use sequences for auto-incrementing columns;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO <role_name>;

-- Grant USAGE on all sequences added in the future
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO <role_name>;