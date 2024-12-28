CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE Students (
    USN VARCHAR(10) PRIMARY KEY,
    name BYTEA NOT NULL, 
    address BYTEA NOT NULL, 
    email BYTEA UNIQUE NOT NULL,
	number BYTEA UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Batches table
CREATE TABLE Batches (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    timing VARCHAR(100) NOT NULL
);



-- Create the Payments table
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
	payment_id BYTEA NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(USN)
);

-- Create the Registrations table
CREATE TABLE Registrations (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    batch_name INT NOT NULL,
    month DATE NOT NULL,
    payment_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES Students(USN),
    FOREIGN KEY (batch_name) REFERENCES Batches(batch_name)
);

CREATE TABLE Admins (
    encrypted_username BYTEA NOT NULL,
    hashed_password TEXT NOT NULL
);


INSERT INTO Admins (encrypted_username, hashed_password)
VALUES (
    pgp_sym_encrypt('adminUser', 'my-secret-key'),
    crypt('securePassword123', gen_salt('bf'))
);