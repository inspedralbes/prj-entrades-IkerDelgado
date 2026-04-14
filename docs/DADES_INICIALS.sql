-- Script SQL de dades inicials per TicketHub

-- Usuaris (password: password)
INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES 
('Administrador', 'admin@example.com', '$2y$12$clZ.Xv.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ', 'admin', NOW(), NOW()),
('Client de Prova', 'client@example.com', '$2y$12$clZ.Xv.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ.XQ', 'client', NOW(), NOW());

-- Esdeveniments
INSERT INTO events (title, artist, description, image, created_at, updated_at) VALUES 
('Primavera Sound 2026', 'Vàrios Artistes', 'El festival més gran de Barcelona torna amb una edició espectacular al Parc del Fòrum.', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop', NOW(), NOW()),
('Concert Estopa', 'Estopa', 'Gira 25 aniversari al Palau Sant Jordi. Una nit única de rumba i rock.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop', NOW(), NOW());

-- Sessions
INSERT INTO event_sessions (event_id, date_time, venue, created_at, updated_at) VALUES 
(1, '2026-06-05 18:00:00', 'Parc del Fòrum', NOW(), NOW()),
(2, '2026-07-10 21:00:00', 'Palau Sant Jordi', NOW(), NOW());

-- Seients (Exemple de fila A per a la sessió 1)
INSERT INTO seats (row, number, price, created_at, updated_at) VALUES 
('A', 1, 55.00, NOW(), NOW()),
('A', 2, 55.00, NOW(), NOW()),
('A', 3, 55.00, NOW(), NOW()),
('A', 4, 55.00, NOW(), NOW()),
('A', 5, 55.00, NOW(), NOW()),
('A', 6, 55.00, NOW(), NOW());

-- Estats inicials (Seients disponibles per a la sessió 1)
INSERT INTO seat_status (session_id, seat_id, status, created_at, updated_at) VALUES 
(1, 1, 'available', NOW(), NOW()),
(1, 2, 'available', NOW(), NOW()),
(1, 3, 'available', NOW(), NOW()),
(1, 4, 'available', NOW(), NOW()),
(1, 5, 'available', NOW(), NOW()),
(1, 6, 'available', NOW(), NOW());
