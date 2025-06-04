-- Seed default genre access for all users
INSERT INTO "GenreAccess" ("userId", "genreId")
SELECT u."id", g."id"
FROM "User" u
CROSS JOIN "Genre" g
WHERE g."name" = 'データベース'
ON CONFLICT DO NOTHING;
