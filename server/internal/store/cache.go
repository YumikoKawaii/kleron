package store

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
	"google.golang.org/protobuf/encoding/protojson"

	kleronv1 "kleron/server/pb/kleron/v1"
)

const (
	cardKeyPrefix = "kleron:card:"
	deckKey       = "kleron:deck"
)

// CardCache is the interface for the warm card cache.
// Consumers get O(1) card lookups and random draws without touching the DB.
// Swap implementations freely: redisCache for prod, an in-memory stub for tests.
type CardCache interface {
	GetCard(ctx context.Context, id string) (*kleronv1.Card, error)
	DrawRandom(ctx context.Context, count int) ([]*kleronv1.Card, error)
	Warm(ctx context.Context, cards []*kleronv1.Card) error
	Close()
}

type redisCache struct {
	client *redis.Client
}

func newRedisCache(client *redis.Client) CardCache {
	return &redisCache{client: client}
}

func (r *redisCache) Close() { r.client.Close() }

func (r *redisCache) Warm(ctx context.Context, cards []*kleronv1.Card) error {
	pipe := r.client.Pipeline()
	members := make([]interface{}, 0, len(cards))

	for _, c := range cards {
		data, err := protojson.Marshal(c)
		if err != nil {
			return err
		}
		pipe.Set(ctx, cardKeyPrefix+c.Id, data, 0)
		members = append(members, c.Id)
	}
	pipe.Del(ctx, deckKey)
	pipe.SAdd(ctx, deckKey, members...)

	_, err := pipe.Exec(ctx)
	return err
}

func (r *redisCache) GetCard(ctx context.Context, id string) (*kleronv1.Card, error) {
	data, err := r.client.Get(ctx, cardKeyPrefix+id).Bytes()
	if err != nil {
		return nil, fmt.Errorf("card not found: %s", id)
	}
	var c kleronv1.Card
	return &c, protojson.Unmarshal(data, &c)
}

func (r *redisCache) DrawRandom(ctx context.Context, count int) ([]*kleronv1.Card, error) {
	ids, err := r.client.SRandMemberN(ctx, deckKey, int64(count)).Result()
	if err != nil {
		return nil, fmt.Errorf("redis draw: %w", err)
	}

	pipe := r.client.Pipeline()
	cmds := make([]*redis.StringCmd, len(ids))
	for i, id := range ids {
		cmds[i] = pipe.Get(ctx, cardKeyPrefix+id)
	}
	if _, err := pipe.Exec(ctx); err != nil {
		return nil, fmt.Errorf("redis pipeline: %w", err)
	}

	cards := make([]*kleronv1.Card, len(cmds))
	for i, cmd := range cmds {
		data, err := cmd.Bytes()
		if err != nil {
			return nil, err
		}
		var c kleronv1.Card
		if err := protojson.Unmarshal(data, &c); err != nil {
			return nil, err
		}
		cards[i] = &c
	}
	return cards, nil
}
