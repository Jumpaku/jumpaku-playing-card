.PHONY: migrate
migrate:
	docker compose exec work migrate \
		-path migration \
		-database "postgres://postgres:password@postgres:5432/main?sslmode=disable" \
		up
