package store

import (
	"context"
	"math/rand"

	kleronv1 "kleron/server/pb/kleron/v1"
)

// warmCards loads all cards from DB and pushes them into the cache.
// Called once during startup; safe to re-run.
func (s *Store) warmCards(ctx context.Context) error {
	rows, err := s.pool.Query(ctx,
		`SELECT id, name, number, suit, image_url, upright_meaning, reversed_meaning, keywords, description FROM cards`,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	var cards []*kleronv1.Card
	for rows.Next() {
		var c kleronv1.Card
		var suit string
		var keywords []string
		if err := rows.Scan(&c.Id, &c.Name, &c.Number, &suit, &c.ImageUrl, &c.UprightMeaning, &c.ReversedMeaning, &keywords, &c.Description); err != nil {
			return err
		}
		c.Suit = suitEnum(suit)
		c.Keywords = keywords
		cards = append(cards, &c)
	}
	if err := rows.Err(); err != nil {
		return err
	}

	return s.cache.Warm(ctx, cards)
}

func (s *Store) DrawCards(ctx context.Context, count int, question, spreadType, userID string) ([]*kleronv1.Card, string, error) {
	drawn, err := s.cache.DrawRandom(ctx, count)
	if err != nil {
		return nil, "", err
	}
	for _, card := range drawn {
		card.IsReversed = rand.Intn(2) == 1
	}

	var readingID string
	if err := s.pool.QueryRow(ctx,
		`INSERT INTO readings (user_id, question, spread_type) VALUES ($1, $2, $3) RETURNING id`,
		userID, question, spreadType,
	).Scan(&readingID); err != nil {
		return nil, "", err
	}

	for pos, card := range drawn {
		if _, err := s.pool.Exec(ctx,
			`INSERT INTO reading_cards (reading_id, card_id, position, is_reversed) VALUES ($1, $2, $3, $4)`,
			readingID, card.Id, pos, card.IsReversed,
		); err != nil {
			return nil, "", err
		}
	}

	return drawn, readingID, nil
}

func (s *Store) GetCard(ctx context.Context, id string) (*kleronv1.Card, error) {
	return s.cache.GetCard(ctx, id)
}

func suitEnum(s string) kleronv1.Suit {
	switch s {
	case "major":
		return kleronv1.Suit_SUIT_MAJOR_ARCANA
	case "wands":
		return kleronv1.Suit_SUIT_WANDS
	case "cups":
		return kleronv1.Suit_SUIT_CUPS
	case "swords":
		return kleronv1.Suit_SUIT_SWORDS
	case "pentacles":
		return kleronv1.Suit_SUIT_PENTACLES
	default:
		return kleronv1.Suit_SUIT_UNSPECIFIED
	}
}
