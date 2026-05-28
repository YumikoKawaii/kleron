package store

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"sort"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func (s *Store) migrate(ctx context.Context) error {
	if _, err := s.pool.Exec(ctx, `CREATE SCHEMA IF NOT EXISTS kleron`); err != nil {
		return fmt.Errorf("create schema: %w", err)
	}

	if _, err := s.pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS kleron.schema_migrations (
			name       TEXT        PRIMARY KEY,
			applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`); err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	entries, err := fs.ReadDir(migrationsFS, "migrations")
	if err != nil {
		return err
	}
	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Name() < entries[j].Name()
	})

	for _, entry := range entries {
		name := entry.Name()

		var applied bool
		_ = s.pool.QueryRow(ctx, `SELECT true FROM kleron.schema_migrations WHERE name = $1`, name).Scan(&applied)
		if applied {
			continue
		}

		sql, err := migrationsFS.ReadFile("migrations/" + name)
		if err != nil {
			return fmt.Errorf("read %s: %w", name, err)
		}

		if _, err := s.pool.Exec(ctx, string(sql)); err != nil {
			return fmt.Errorf("apply %s: %w", name, err)
		}

		if _, err := s.pool.Exec(ctx, `INSERT INTO kleron.schema_migrations (name) VALUES ($1)`, name); err != nil {
			return fmt.Errorf("record %s: %w", name, err)
		}

		log.Printf("migration applied: %s", name)
	}

	return nil
}
