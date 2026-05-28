.PHONY: gen tools server client up down tidy install

tools:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
	npm install -g @bufbuild/protoc-gen-es @connectrpc/protoc-gen-connect-es

gen:
	cd proto && buf generate

server:
	cd server && go run ./cmd/server

client:
	cd client && npm run dev

up:
	docker compose up -d

down:
	docker compose down

tidy:
	cd server && go mod tidy

install:
	cd client && npm install
