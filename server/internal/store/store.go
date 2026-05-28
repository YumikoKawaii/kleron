package store

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

// Store is the single concrete implementation of all repository interfaces.
// Handlers never import this type directly — they depend on their own interfaces.
type Store struct {
	pool  *pgxpool.Pool
	cache CardCache
}

func New(ctx context.Context, dsn, redisURL string) (*Store, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("redis url: %w", err)
	}
	rdb := redis.NewClient(opt)
	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("redis ping: %w", err)
	}

	s := &Store{
		pool:  pool,
		cache: newRedisCache(rdb),
	}

	if err := s.migrate(ctx); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}
	if err := s.warmCards(ctx); err != nil {
		return nil, fmt.Errorf("warm cards: %w", err)
	}
	if err := s.seedDevUser(ctx); err != nil {
		return nil, fmt.Errorf("seed dev user: %w", err)
	}
	return s, nil
}

func (s *Store) Close() {
	s.pool.Close()
	s.cache.Close()
}
