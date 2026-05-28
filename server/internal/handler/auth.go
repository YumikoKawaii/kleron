package handler

import (
	"context"

	"connectrpc.com/connect"

	kleronv1 "kleron/server/gen/kleron/v1"
)

// AuthStore is the exact surface the AuthHandler needs from the store layer.
// store.Store satisfies this implicitly.
type AuthStore interface {
	GetUser(ctx context.Context, id string) (*kleronv1.User, error)
	UpsertUser(ctx context.Context, user *kleronv1.User) error
}

type AuthHandler struct {
	store AuthStore
}

func NewAuthHandler(store AuthStore) *AuthHandler {
	return &AuthHandler{store: store}
}

func (h *AuthHandler) GetAuthURL(_ context.Context, req *connect.Request[kleronv1.GetAuthURLRequest]) (*connect.Response[kleronv1.GetAuthURLResponse], error) {
	// TODO: build real OAuth URL using req.Msg.Provider, req.Msg.CodeChallenge, req.Msg.State
	_ = req.Msg
	return connect.NewResponse(&kleronv1.GetAuthURLResponse{
		Url: "https://accounts.google.com/o/oauth2/v2/auth?stub=true",
	}), nil
}

func (h *AuthHandler) ExchangeCode(_ context.Context, req *connect.Request[kleronv1.ExchangeCodeRequest]) (*connect.Response[kleronv1.ExchangeCodeResponse], error) {
	// TODO: verify state, exchange code+verifier with Google, call h.store.UpsertUser, issue JWT
	_ = req.Msg
	return connect.NewResponse(&kleronv1.ExchangeCodeResponse{
		AccessToken: "stub-jwt",
		ExpiresIn:   3600,
		User:        &kleronv1.User{Id: "stub-user-id", Email: "stub@example.com", Name: "Stub User"},
	}), nil
}

func (h *AuthHandler) GetMe(ctx context.Context, _ *connect.Request[kleronv1.GetMeRequest]) (*connect.Response[kleronv1.GetMeResponse], error) {
	userID, ok := UserIDFromCtx(ctx)
	if !ok {
		return nil, connect.NewError(connect.CodeUnauthenticated, nil)
	}
	user, err := h.store.GetUser(ctx, userID)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}
	return connect.NewResponse(&kleronv1.GetMeResponse{User: user}), nil
}

func (h *AuthHandler) Logout(_ context.Context, _ *connect.Request[kleronv1.LogoutRequest]) (*connect.Response[kleronv1.LogoutResponse], error) {
	return connect.NewResponse(&kleronv1.LogoutResponse{}), nil
}
