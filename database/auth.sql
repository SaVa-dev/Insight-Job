SELECT * FROM users WHERE username = $1

SELECT user_id, username, usermail, creation_date, is_active FROM users WHERE user_id = $1

INSERT INTO users (username, usermail, password)
VALUES ($1, $2, $3)
RETURNING user_id, username, usermail, creation_date