CREATE TABLE IF NOT EXISTS games(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  category VARCHAR(100),
  release_date DATE,
  price NUMERIC
);

CREATE TABLE IF NOT EXISTS orders(
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100),
  items JSON,
  total_price NUMERIC
);

-- Insert sample games
INSERT INTO games (name, category, release_date, price) VALUES
('The Witcher 3', 'RPG', '2015-05-19', 29.99),
('Cyberpunk 2077', 'RPG', '2020-12-10', 59.99),
('FIFA 24', 'Sports', '2023-09-29', 49.99),
('Minecraft', 'Sandbox', '2011-11-18', 19.99),
('Elden Ring', 'RPG', '2022-02-25', 59.99),
('Call of Duty: Modern Warfare', 'Shooter', '2019-10-25', 69.99),
('Among Us', 'Casual', '2018-11-16', 4.99),
('GTA V', 'Action', '2013-09-17', 29.99),
('Red Dead Redemption 2', 'Adventure', '2018-10-26', 59.99),
('Forza Horizon 5', 'Racing', '2021-11-09', 59.99);
