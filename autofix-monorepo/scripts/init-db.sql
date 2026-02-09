-- AutoFix Database Initialization Script
-- This script creates separate schemas for each microservice

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS work_order;
CREATE SCHEMA IF NOT EXISTS notification;

-- Grant privileges to autofix user
GRANT ALL PRIVILEGES ON SCHEMA auth TO autofix;
GRANT ALL PRIVILEGES ON SCHEMA inventory TO autofix;
GRANT ALL PRIVILEGES ON SCHEMA work_order TO autofix;
GRANT ALL PRIVILEGES ON SCHEMA notification TO autofix;

-- Set default search path
ALTER DATABASE autofix SET search_path TO public, auth, inventory, work_order, notification;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE DATABASE auth_db;

-- Output confirmation
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully';
    RAISE NOTICE 'Created schemas: auth, inventory, work_order, notification';
END $$;
