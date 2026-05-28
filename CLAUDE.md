# Kleron — Tarot Reading App

## What this is
A tarot reading web app with animated card drawing, per-card explanations, reading history, and (later) combo/spread interpretation. The key UX differentiator is smooth multi-card animations and a nostalgic, warm-magic visual aesthetic.

## Stack

### Transport
- **ConnectRPC** (HTTP/2) end-to-end: proto definitions → `buf generate` → Go server stubs + TypeScript client
- No plain HTTP endpoints. Auth callback is handled client-side (PKCE OAuth flow)
- Proto source lives in `proto/kleron/v1/`, buf configs in `proto/`, generated code in `server/pb/` and `client/src/pb/`

### Backend (`server/`)
- **Go** with `connectrpc.com/connect`
- **PostgreSQL** via `pgx/v5` for reading history and user data
- No framework — stdlib `net/http` mux + connect handler mounting

### Frontend (`client/`)
- **React 18 + TypeScript + Vite**
- **Framer Motion** for all card animations (draw, fan, flip, reveal)
- **Tailwind CSS** with a custom warm-parchment palette
- **`@connectrpc/connect-web`** generated client — same proto types as server
- React Router v6 for routing

### Auth
- PKCE OAuth (Google). Frontend owns the `/auth/callback` route, extracts `code` from URL, calls `AuthService.ExchangeCode` via RPC.
- JWT stored in `localStorage`. A ConnectRPC interceptor attaches it to every request and redirects to `/login` on `CodeUnauthenticated`.

## Aesthetic
Nostalgic, magic, a bit light. Think warm parchment, soft golds, faded ink — like an old illustrated tarot book, not a gothic dungeon. Framer Motion animations should feel weighty and deliberate, not snappy.

## Key commands

### Codegen (run from proto/)
```sh
cd proto && buf generate    # regenerates server/pb/ and client/src/pb/
```

### Backend
```sh
cd server
go mod tidy
go run ./cmd/server   # starts on :8080
```

### Frontend
```sh
cd client
pnpm install
pnpm dev              # starts on :5173, proxies /rpc → :8080
```

### Database
```sh
# expects DATABASE_URL env var, e.g.:
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/kleron
```

## Commit messages

Skip the technical description. Write something that sounds magical — evocative, a little poetic, like a tarot card title or an incantation. One line is enough.

```
# good
The cards are dealt
Shadows take their place
The wheel begins to turn
A new path opens

# bad
Add Redis cache and refactor store layer
Fix DrawCards user ID parameter
```

## Go OOP practices

Go is not Java. Follow these rules — strict enough to keep the code clean, loose enough not to fight the language.

### Interfaces belong to the consumer, not the producer
Define interfaces in the package that *uses* them, not the package that *implements* them. Handlers declare exactly the store methods they need; `store.Store` satisfies them implicitly.

```go
// handler/tarot.go — handler owns this
type TarotStore interface {
    DrawCards(ctx, count, question, spreadType, userID) ([]*Card, string, error)
    GetCard(ctx, id) (*Card, error)
    ...
}
```

### Small, focused interfaces (Go ISP)
Each handler gets its own interface with only the methods it actually calls. `AuthHandler` must not receive an interface that exposes `DrawCards`.

### Constructors always return the interface, accept interfaces
```go
// good
func NewTarotHandler(store TarotStore) *TarotHandler

// bad — couples handler to a concrete store type
func NewTarotHandler(store *store.Store) *TarotHandler
```

### Composition over large structs
Split large files by domain, not by type. `store/` has `cards.go`, `readings.go`, `users.go` — one concern per file, all sharing the same `Store` struct.

### Unexported fields, exported behaviour
Struct fields are unexported. Behaviour is exported via methods. No public `Db`, `Redis`, `Pool` fields hanging off structs.

### No service layer tax
For this project size, handlers call the store directly. Do not add a `service/` layer unless a piece of logic is reused by more than one handler — premature indirection is the enemy.

## Project structure
```
kleron/
├── proto/
│   ├── buf.yaml
│   ├── buf.gen.yaml
│   └── kleron/v1/
│       ├── tarot.proto   # TarotService: DrawCards, GetCard, History
│       └── auth.proto    # AuthService: GetAuthURL, ExchangeCode, GetMe
├── server/
│   ├── cmd/server/main.go
│   ├── internal/
│   │   ├── handler/      # connectrpc handler implementations
│   │   ├── service/      # business logic
│   │   └── store/        # postgres queries
│   └── gen/              # buf-generated Go code (do not edit)
└── client/
    ├── src/
    │   ├── gen/          # buf-generated TS code (do not edit)
    │   ├── components/cards/
    │   ├── pages/
    │   ├── hooks/
    │   └── lib/          # rpc client setup, auth interceptor
    └── public/cards/     # card artwork
```
