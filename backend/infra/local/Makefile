.PHONY: docker-up
docker-up:
	docker compose up -d --build

.PHONY: docker-exec
docker-exec:
	docker compose exec work bash

.PHONY: migrate
migrate: ## make migrate-local
	docker compose exec -w /workspace/backend/infra/ work migrate \
		-path migration \
		-database "postgres://postgres:password@postgres:5432/app?sslmode=disable" \
		up


.PHONY: psql
psql: ## make migrate-local
	docker compose exec -w /workspace/backend/infra/ work migrate \
		-path migration \
		-database "postgres://postgres:password@postgres:5432/app?sslmode=disable" \
		up
