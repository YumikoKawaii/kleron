package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"connectrpc.com/connect"
	connectcors "connectrpc.com/cors"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	kleronv1connect "kleron/server/gen/kleron/v1/kleronv1connect"
	"kleron/server/internal/handler"
	"kleron/server/internal/store"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/kleron"
	}
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	db, err := store.New(context.Background(), dbURL, redisURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer db.Close()

	mux := http.NewServeMux()

	interceptors := connect.WithInterceptors(handler.AuthInterceptor())

	tarotHandler := handler.NewTarotHandler(db)
	mux.Handle(kleronv1connect.NewTarotServiceHandler(tarotHandler, interceptors))

	authHandler := handler.NewAuthHandler(db)
	mux.Handle(kleronv1connect.NewAuthServiceHandler(authHandler))

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: connectcors.AllowedMethods(),
		AllowedHeaders: connectcors.AllowedHeaders(),
		ExposedHeaders: connectcors.ExposedHeaders(),
	})

	addr := ":8080"
	log.Printf("server listening on %s", addr)
	if err := http.ListenAndServe(addr, h2c.NewHandler(corsHandler.Handler(mux), &http2.Server{})); err != nil {
		log.Fatal(err)
	}
}
