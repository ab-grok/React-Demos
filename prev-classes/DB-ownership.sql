-- 1) ===> Creating a new role (group);
CREATE ROLE <role_name> NOLOGIN;


-- 2) ===> Add roles to role group
GRANT <role_name> TO <role_name1>, <role_name2>;


-- 3) ===> Change database ownership
ALTER DATABASE shooter OWNER TO <role_name>;


-- 3) ===> Change schema ownership
ALTER SCHEMA <schema_name> OWNER TO <role_name>;


-- 4) ===> Query to check the ownership of current database;
SELECT pg_get_userbyid(datdba)
FROM pg_database
WHERE datname = current_database();


-- 5) ===> Query to check the ownership of schemas in the database
SELECT nspname AS schema,
       pg_get_userbyid(nspowner) AS owner -- pg_get_userbyid() returns the username for the id in nspowner column;
FROM pg_namespace 
WHERE nspname NOT LIKE 'pg_%'
AND nspname <> 'information_schema'                 
ORDER BY schema;


-- 6) ===> Query to check the ownership of all tables in database;  
SELECT schemaname,
       tablename,
       tableowner
FROM pg_tables
WHERE schemaname NOT LIKE 'pg_%'
AND schemaname <> 'information_schema'
ORDER BY schemaname, tablename;


-- 7) ===> Query to transfer ownwership of all schemas in the database to a new role;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT nspname  -- column holding all schema names in pg_namespace;
             FROM pg_namespace -- system catalog table that contains a row for each schema in the database;
             WHERE nspname NOT LIKE 'pg_%' -- Exclude 'system' schemas that start with 'pg_'
               AND nspname <> 'information_schema' -- <> does the same as !=; 
    LOOP
        EXECUTE 'ALTER SCHEMA ' 
        || quote_ident(r.nspname) 
        || ' OWNER TO <role_name> ;';
    END LOOP; 
END $$;


-- 8) ===> Transfer ownership of all tables in a schema
DO $$ -- The two dollar signs (`$$`) are used to define a string literal that can contain multiple lines and special characters without needing to escape them;
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = <schema>
    LOOP -- LOOP over each r in tablename[];
        EXECUTE 'ALTER TABLE <schema_name>.' 
        || quote_ident(r.tablename) 
        || ' OWNER TO <role_name>;';
    END LOOP;
END $$;


-- 9) ===> Query to grant READ/WRITE access on all tables in all schemas to new role;
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT nspname
             FROM pg_namespace
             WHERE nspname NOT LIKE 'pg_%' 
               AND nspname <> 'information_schema' 
    LOOP
        EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ' 
        || quote_ident(r.nspname) 
        || ' TO <role_name>;'; 
    END LOOP; 
END $$;


-- 10) ===> Grant READ/WRITE access on the schema and tables to the new role;
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