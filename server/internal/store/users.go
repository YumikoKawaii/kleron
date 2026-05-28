package store

import (
	"context"

	kleronv1 "kleron/server/gen/kleron/v1"
)

const devUserID = "00000000-0000-0000-0000-000000000001"

func (s *Store) seedDevUser(ctx context.Context) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO users (id, email, name) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
		devUserID, "dev@kleron.local", "Dev User",
	)
	return err
}

func (s *Store) GetUser(ctx context.Context, id string) (*kleronv1.User, error) {
	var u kleronv1.User
	if err := s.pool.QueryRow(ctx,
		`SELECT id, email, name, avatar_url FROM users WHERE id = $1`, id,
	).Scan(&u.Id, &u.Email, &u.Name, &u.AvatarUrl); err != nil {
		return nil, err
	}
	return &u, nil
}

func (s *Store) UpsertUser(ctx context.Context, user *kleronv1.User) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO users (id, email, name, avatar_url) VALUES ($1, $2, $3, $4)
		 ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url`,
		user.Id, user.Email, user.Name, user.AvatarUrl,
	)
	return err
}
