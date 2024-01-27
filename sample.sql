CREATE TABLE company(
    ID serial PRIMARY KEY,
    hashid VARCHAR(255) NOT NULL,
    companyid VARCHAR(255) NOT NULL,
    companypass VARCHAR(255) NOT NULL,
    descript TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    tin VARCHAR(255) NOT NULL,
    employer_id VARCHAR(255),
    links TEXT
);

CREATE TABLE resources(
    ID serial PRIMARY KEY,
    resourceid VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL,
    resource_type VARCHAR(255) NOT NULL,
    resource_role TEXT NOT NULL,
    resource_size TEXT NOT NULL,
    datetime_stamp TEXT
);

ALTER TABLE company
ADD COLUMN companyname VARCHAR(255);

CREATE TABLE candidates(
    ID serial PRIMARY KEY,
    hashid VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email TEXT NOT NULL,
    skills TEXT,
    education TEXT,
    adress TEXT,
    drafts TEXT);