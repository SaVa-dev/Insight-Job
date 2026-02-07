-- 1️⃣ Jobs
INSERT INTO jobs (title, company, location, source)
VALUES
('Backend Developer', 'Acme Inc', 'Remote', 'LinkedIn'),
('Data Engineer', 'DataCorp', 'CDMX', 'Indeed'),
('Frontend Developer', 'WebSolutions', 'Remote', 'LinkedIn'),
('DevOps Engineer', 'CloudNet', 'Monterrey', 'Indeed'),
('Fullstack Developer', 'TechFactory', 'Guadalajara', 'LinkedIn'),
('Machine Learning Engineer', 'AI Labs', 'Remote', 'LinkedIn'),
('Product Manager', 'Innovatech', 'CDMX', 'Indeed'),
('QA Engineer', 'TestIt', 'Guadalajara', 'LinkedIn'),
('Mobile Developer', 'AppWorld', 'Remote', 'Indeed'),
('Data Analyst', 'DataCorp', 'CDMX', 'LinkedIn');

-- 2️⃣ Skills
INSERT INTO skills (name)
VALUES
('Node.js'), ('PostgreSQL'), ('Docker'), ('Python'), ('SQL'), ('Airflow'),
('React'), ('AWS'), ('Kubernetes'), ('Django'), ('Flutter'), ('Java'),
('Agile'), ('Testing'), ('Swift')
ON CONFLICT (id) DO NOTHING; -- id es la PK

-- 3️⃣ Job-Skills associations
-- Backend Developer
INSERT INTO job_skills (job_id, skill_id)
VALUES
((SELECT id FROM jobs WHERE title='Backend Developer' AND company='Acme Inc'), (SELECT id FROM skills WHERE name='Node.js')),
((SELECT id FROM jobs WHERE title='Backend Developer' AND company='Acme Inc'), (SELECT id FROM skills WHERE name='PostgreSQL')),
((SELECT id FROM jobs WHERE title='Backend Developer' AND company='Acme Inc'), (SELECT id FROM skills WHERE name='Docker')),

-- Data Engineer
((SELECT id FROM jobs WHERE title='Data Engineer' AND company='DataCorp'), (SELECT id FROM skills WHERE name='Python')),
((SELECT id FROM jobs WHERE title='Data Engineer' AND company='DataCorp'), (SELECT id FROM skills WHERE name='SQL')),
((SELECT id FROM jobs WHERE title='Data Engineer' AND company='DataCorp'), (SELECT id FROM skills WHERE name='Airflow')),

-- Frontend Developer
((SELECT id FROM jobs WHERE title='Frontend Developer' AND company='WebSolutions'), (SELECT id FROM skills WHERE name='React')),
((SELECT id FROM jobs WHERE title='Frontend Developer' AND company='WebSolutions'), (SELECT id FROM skills WHERE name='CSS')),

-- DevOps Engineer
((SELECT id FROM jobs WHERE title='DevOps Engineer' AND company='CloudNet'), (SELECT id FROM skills WHERE name='Docker')),
((SELECT id FROM jobs WHERE title='DevOps Engineer' AND company='CloudNet'), (SELECT id FROM skills WHERE name='AWS')),
((SELECT id FROM jobs WHERE title='DevOps Engineer' AND company='CloudNet'), (SELECT id FROM skills WHERE name='Kubernetes')),

-- Fullstack Developer
((SELECT id FROM jobs WHERE title='Fullstack Developer' AND company='TechFactory'), (SELECT id FROM skills WHERE name='Node.js')),
((SELECT id FROM jobs WHERE title='Fullstack Developer' AND company='TechFactory'), (SELECT id FROM skills WHERE name='React')),
((SELECT id FROM jobs WHERE title='Fullstack Developer' AND company='TechFactory'), (SELECT id FROM skills WHERE name='Docker')),

-- Machine Learning Engineer
((SELECT id FROM jobs WHERE title='Machine Learning Engineer' AND company='AI Labs'), (SELECT id FROM skills WHERE name='Python')),
((SELECT id FROM jobs WHERE title='Machine Learning Engineer' AND company='AI Labs'), (SELECT id FROM skills WHERE name='Django')),

-- Product Manager
((SELECT id FROM jobs WHERE title='Product Manager' AND company='Innovatech'), (SELECT id FROM skills WHERE name='Agile')),

-- QA Engineer
((SELECT id FROM jobs WHERE title='QA Engineer' AND company='TestIt'), (SELECT id FROM skills WHERE name='Testing')),

-- Mobile Developer
((SELECT id FROM jobs WHERE title='Mobile Developer' AND company='AppWorld'), (SELECT id FROM skills WHERE name='Flutter')),
((SELECT id FROM jobs WHERE title='Mobile Developer' AND company='AppWorld'), (SELECT id FROM skills WHERE name='Swift')),

-- Data Analyst
((SELECT id FROM jobs WHERE title='Data Analyst' AND company='DataCorp'), (SELECT id FROM skills WHERE name='SQL'))
ON CONFLICT DO NOTHING;

-- 4️⃣ Job Snapshots
INSERT INTO job_snapshots (job_id, scrape_date, salary_min, salary_max, experience_years, applicants_count)
VALUES
((SELECT id FROM jobs WHERE title='Backend Developer' AND company='Acme Inc'), CURRENT_DATE, 50000, 80000, 3, 42),
((SELECT id FROM jobs WHERE title='Data Engineer' AND company='DataCorp'), CURRENT_DATE, 60000, 90000, 4, 18),
((SELECT id FROM jobs WHERE title='Frontend Developer' AND company='WebSolutions'), CURRENT_DATE, 45000, 70000, 2, 25),
((SELECT id FROM jobs WHERE title='DevOps Engineer' AND company='CloudNet'), CURRENT_DATE, 55000, 85000, 4, 30),
((SELECT id FROM jobs WHERE title='Fullstack Developer' AND company='TechFactory'), CURRENT_DATE, 50000, 90000, 3, 20),
((SELECT id FROM jobs WHERE title='Machine Learning Engineer' AND company='AI Labs'), CURRENT_DATE, 70000, 120000, 5, 12),
((SELECT id FROM jobs WHERE title='Product Manager' AND company='Innovatech'), CURRENT_DATE, 65000, 100000, 4, 15),
((SELECT id FROM jobs WHERE title='QA Engineer' AND company='TestIt'), CURRENT_DATE, 40000, 60000, 2, 28),
((SELECT id FROM jobs WHERE title='Mobile Developer' AND company='AppWorld'), CURRENT_DATE, 50000, 85000, 3, 22),
((SELECT id FROM jobs WHERE title='Data Analyst' AND company='DataCorp'), CURRENT_DATE, 48000, 75000, 2, 35)
ON CONFLICT (job_id, scrape_date) DO NOTHING;
