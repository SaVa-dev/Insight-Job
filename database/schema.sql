-- ==========================================
-- SCHEMA - Job Scraper App
-- ==========================================

-- Tables without foreign keys

CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(16) NOT NULL,
    usermail VARCHAR(32) NOT NULL,
    password VARCHAR(64) NOT NULL, -- hash SHA256
    creation_date TIMESTAMP NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE companies(
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE skills(
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE locations(
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    country VARCHAR(32) NOT NULL,
    country_code VARCHAR(2)
);


-- Tables with foreign keys

CREATE TABLE jobs(
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    source_url TEXT NOT NULL UNIQUE,
    fingerprint VARCHAR(32) NOT NULL UNIQUE, -- hash MD5
    experience_min NUMERIC(4, 1),
    experience_max NUMERIC(4, 1),
    first_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    company_id UUID NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

CREATE TABLE user_profile(
    user_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    experience_min NUMERIC(4, 1),
    experience_max NUMERIC(4, 1),
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- Intermediate tables

CREATE TABLE user_job(
    user_job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    has_applied BOOLEAN NOT NULL DEFAULT FALSE,
    favorite BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL,
    job_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id)
);

CREATE TABLE job_skill(
    job_skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE job_location(
    job_location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    location_id UUID NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE company_location(
    company_location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    location_id UUID NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE user_profile_location(
    user_profile_location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL,
    location_id UUID NOT NULL,
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(user_profile_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE user_profile_skill(
    user_profile_skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(user_profile_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE user_profile_company(
    user_profile_company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL,
    company_id UUID NOT NULL,
    FOREIGN KEY (user_profile_id) REFERENCES user_profile(user_profile_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);