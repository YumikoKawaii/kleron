package handler

import (
	"context"

	"connectrpc.com/connect"

	kleronv1 "kleron/server/gen/kleron/v1"
)

// TarotStore is the exact surface the TarotHandler needs from the store layer.
// store.Store satisfies this implicitly.
type TarotStore interface {
	DrawCards(ctx context.Context, count int, question, spreadType, userID string) ([]*kleronv1.Card, string, error)
	GetCard(ctx context.Context, id string) (*kleronv1.Card, error)
	GetReadingHistory(ctx context.Context, userID string, page, pageSize int) ([]*kleronv1.Reading, int, error)
	SaveReading(ctx context.Context, userID string, cardIDs []string, reversals []bool, question, spreadType string) (*kleronv1.Reading, error)
}

type TarotHandler struct {
	store TarotStore
}

func NewTarotHandler(store TarotStore) *TarotHandler {
	return &TarotHandler{store: store}
}

func (h *TarotHandler) DrawCards(ctx context.Context, req *connect.Request[kleronv1.DrawCardsRequest]) (*connect.Response[kleronv1.DrawCardsResponse], error) {
	userID, _ := UserIDFromCtx(ctx)
	cards, readingID, err := h.store.DrawCards(ctx, int(req.Msg.Count), req.Msg.Question, req.Msg.SpreadType, userID)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&kleronv1.DrawCardsResponse{
		Cards:     cards,
		ReadingId: readingID,
	}), nil
}

func (h *TarotHandler) GetCard(ctx context.Context, req *connect.Request[kleronv1.GetCardRequest]) (*connect.Response[kleronv1.GetCardResponse], error) {
	card, err := h.store.GetCard(ctx, req.Msg.CardId)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}
	return connect.NewResponse(&kleronv1.GetCardResponse{Card: card}), nil
}

func (h *TarotHandler) GetReadingHistory(ctx context.Context, req *connect.Request[kleronv1.GetReadingHistoryRequest]) (*connect.Response[kleronv1.GetReadingHistoryResponse], error) {
	userID, _ := UserIDFromCtx(ctx)
	readings, total, err := h.store.GetReadingHistory(ctx, userID, int(req.Msg.Page), int(req.Msg.PageSize))
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&kleronv1.GetReadingHistoryResponse{
		Readings: readings,
		Total:    int32(total),
	}), nil
}

func (h *TarotHandler) SaveReading(ctx context.Context, req *connect.Request[kleronv1.SaveReadingRequest]) (*connect.Response[kleronv1.SaveReadingResponse], error) {
	userID, _ := UserIDFromCtx(ctx)
	reading, err := h.store.SaveReading(ctx, userID, req.Msg.CardIds, req.Msg.Reversals, req.Msg.Question, req.Msg.SpreadType)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&kleronv1.SaveReadingResponse{Reading: reading}), nil
}
