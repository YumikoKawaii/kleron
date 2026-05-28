package store

import (
	"context"
	"time"

	"google.golang.org/protobuf/types/known/timestamppb"

	kleronv1 "kleron/server/gen/kleron/v1"
)

func (s *Store) GetReadingHistory(ctx context.Context, userID string, page, pageSize int) ([]*kleronv1.Reading, int, error) {
	if pageSize <= 0 {
		pageSize = 20
	}
	if page <= 0 {
		page = 1
	}

	var total int
	if err := s.pool.QueryRow(ctx, `SELECT COUNT(*) FROM readings WHERE user_id = $1`, userID).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := s.pool.Query(ctx,
		`SELECT id, question, spread_type, created_at FROM readings WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
		userID, pageSize, (page-1)*pageSize,
	)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var readings []*kleronv1.Reading
	for rows.Next() {
		var r kleronv1.Reading
		var createdAt time.Time
		if err := rows.Scan(&r.Id, &r.Question, &r.SpreadType, &createdAt); err != nil {
			return nil, 0, err
		}
		r.UserId = userID
		r.CreatedAt = timestamppb.New(createdAt)

		cardRows, err := s.pool.Query(ctx,
			`SELECT card_id, is_reversed FROM reading_cards WHERE reading_id = $1 ORDER BY position`,
			r.Id,
		)
		if err != nil {
			return nil, 0, err
		}
		for cardRows.Next() {
			var cardID string
			var reversed bool
			if err := cardRows.Scan(&cardID, &reversed); err != nil {
				cardRows.Close()
				return nil, 0, err
			}
			if card, err := s.cache.GetCard(ctx, cardID); err == nil {
				card.IsReversed = reversed
				r.Cards = append(r.Cards, card)
			}
		}
		cardRows.Close()

		readings = append(readings, &r)
	}

	return readings, total, nil
}

func (s *Store) SaveReading(ctx context.Context, userID string, cardIDs []string, reversals []bool, question, spreadType string) (*kleronv1.Reading, error) {
	var readingID string
	if err := s.pool.QueryRow(ctx,
		`INSERT INTO readings (user_id, question, spread_type) VALUES ($1, $2, $3) RETURNING id`,
		userID, question, spreadType,
	).Scan(&readingID); err != nil {
		return nil, err
	}

	reading := &kleronv1.Reading{Id: readingID, UserId: userID, Question: question, SpreadType: spreadType}

	for pos, cardID := range cardIDs {
		rev := pos < len(reversals) && reversals[pos]
		if _, err := s.pool.Exec(ctx,
			`INSERT INTO reading_cards (reading_id, card_id, position, is_reversed) VALUES ($1, $2, $3, $4)`,
			readingID, cardID, pos, rev,
		); err != nil {
			return nil, err
		}
		if card, err := s.cache.GetCard(ctx, cardID); err == nil {
			card.IsReversed = rev
			reading.Cards = append(reading.Cards, card)
		}
	}

	return reading, nil
}
