INSERT INTO departments (name) 
VALUES 
    ('Law'),
    ('Medicine'),
    ('Construction');

INSERT INTO roles (job_title, salary,department_id) 
VALUES 
    ('Intern', 30000, 1),
    ('Lawyer', 100000, 1),
    ('Judge', 120000, 1),
    ('Scribe', 45000, 1),
    ('Intern', 30000, 2),
    ('Physician Assitant', 120000, 2),
    ('Surgeon', 160000, 2),
    ('Receptionist', 30000, 2),
    ('Nurse', 100000, 2),
    ('Intern', 80000, 3),
    ('General Worker', 40000, 3),
    ('Driver', 50000, 3);

INSERT INTO employees (first_name, last_name, manager, role_id)
VALUES 
    ('Smith', 'Thomson', 'Bruce', 5),
    ('Nancy', 'Wayne', 'Bruce', 4),
    ('Jason', 'Smith', 'Will', 3),
    ('Allison', 'Knapp', 'Joe', 2),
    ('Judith', 'Beal', 'Will', 1),
    ('Corrin', 'Albircht', 'Joe', 6),
    ('Joe', 'Allens', 'Nancy', 7),
    ('Corey', 'Silver', 'Nancy', 8),
    ('Gus', 'Foncree', 'George', 9),
    ('Jasmine', 'Russo', 'George', 10),
    ('Pablo', 'Smith', 'Bruce', 11),
    ('Stephany', 'Ryans', 'Carl', 12);
    
