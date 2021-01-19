DROP DATABASE IF EXISTS employeeTracker_db; 

CREATE DATABASE employeeTracker_db; 

USE employeeTracker_db; 

CREATE TABLE departments (
    id INTEGER NOT NULL AUTO_INCREMENT , 
    name VARCHAR(30) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INTEGER NOT NULL AUTO_INCREMENT, 
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL(10,0) NOT NULL, 
    department_id INTEGER NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE employees (
    id INTEGER NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    role_id INTEGER NOT NULL, 
    manager_id INTEGER DEFAULT NULL,
    PRIMARY KEY (id)
);

-- dept seeds
INSERT INTO departments (name)
VALUE ("Sales");
INSERT INTO departments (name)
VALUE ("Engineering");
INSERT INTO departments (name)
VALUE ("Finance");
INSERT INTO departments (name)
VALUE ("Legal");

-- role seeds
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO roles (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);



-- employee seeds
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("John", "Doe", null, 1);
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Mike", "Chan", null, 2);
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Ashley","Rodriguez",null,3);
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Kevin", "Tupik", 1, 4);
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Malia", "Brown", 4, 5);
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Sarah", "Lourd", 1, 6);
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Tom", "Allen", 2, 7);

 
SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;
