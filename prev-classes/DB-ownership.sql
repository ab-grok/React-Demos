-- 1) ===> Query to check the ownership of schemas in the database
SELECT nspname AS schema,
       pg_get_userbyid(nspowner) AS owner -- pg_get_userbyid() returns the username for the id in nspowner column;
FROM pg_namespace
ORDER BY schema;

-- 2) ===> Query to check the ownership of tables in a specific schema
SELECT current_database() as database_name, schemaname,tablename, tableowner FROM pg_tables where schemaname not like 'pg_%' ORDER BY schemaname, tablename;

-- _______________________________________________________
-- 3)  ===> Change schema ownership
ALTER SCHEMA <schema> OWNER TO <role_name>;

-- _______________________________________________________
-- 4 ===> Query to transfer ownwership of all schemas in the database to a new role;
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
        || ' OWNER TO <role_name>';
    END LOOP; 
END $$;

-- 5) ==> Transfer ownership of all tables in a schema
DO $$
-- what's the function of two dollar signs here? The two dollar signs (`$$`) in PostgreSQL are used to define a string literal that can contain multiple lines and special characters without needing to escape them, eg this `DO` block. Without it each segment separated by (;) would be treated as a separate command, and the single quotes within the block would need to be escaped;
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = <schema> --schema name
    LOOP -- LOOP over each r in tablename[];
        EXECUTE 'ALTER TABLE <schema> '
        || quote_ident(r.tablename)
        || ' OWNER TO <role_name>'; --is EXECUTE necessary here? Yes, it initiates `EXECUTE` dynamic SQL query; The `quote_ident` function safely handles any special characters in the table names;
    END LOOP;
END $$;

-- 4) ===> Grant READ/WRITE access on the schema and tables to the new role;
-- Grant permission to connect to the database
GRANT CONNECT ON DATABASE <database> TO <role_name>;

-- Grant USAGE and CREATE on the schema
GRANT USAGE, CREATE ON SCHEMA <schema> TO <role_name>;

-- Grant SELECT, INSERT, UPDATE, DELETE on all existing tables in the schema
-- Unlike ownership queries which require 'ALTER TABLE', You can 'GRANT' these permissions to all tables in a schema in one go;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO <role_name>;

-- Grant SELECT, INSERT, UPDATE, DELETE on all tables added in the future
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO <role_name>;

-- Grant USAGE on all sequences in the schema, to allow the role to use sequences for auto-incrementing columns;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO <role_name>;

-- Grant USAGE on all sequences added in the future
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO <role_name>;