package handler

import (
	"context"
	"log"
	"os"
	"strings"

	"connectrpc.com/connect"
)

type ctxKeyUserID struct{}

const devUserID = "00000000-0000-0000-0000-000000000001"

// AuthInterceptor validates JWT and injects userID into context.
// When AUTH_BYPASS=true, skips validation and uses the dev user ID.
func AuthInterceptor() connect.UnaryInterceptorFunc {
	bypass := os.Getenv("AUTH_BYPASS") == "true"
	if bypass {
		log.Println("⚠️  AUTH_BYPASS=true — all requests run as dev user, do not use in production")
	}

	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			if bypass {
				ctx = context.WithValue(ctx, ctxKeyUserID{}, devUserID)
				return next(ctx, req)
			}

			token := strings.TrimPrefix(req.Header().Get("Authorization"), "Bearer ")
			if token == "" {
				return nil, connect.NewError(connect.CodeUnauthenticated, nil)
			}
			userID, err := validateJWT(token)
			if err != nil {
				return nil, connect.NewError(connect.CodeUnauthenticated, err)
			}
			ctx = context.WithValue(ctx, ctxKeyUserID{}, userID)
			return next(ctx, req)
		}
	}
}

func UserIDFromCtx(ctx context.Context) (string, bool) {
	id, ok := ctx.Value(ctxKeyUserID{}).(string)
	return id, ok
}

// validateJWT stub — replace with real verification (e.g. golang-jwt/jwt/v5).
func validateJWT(token string) (string, error) {
	_ = token
	return "", connect.NewError(connect.CodeUnauthenticated, nil)
}
