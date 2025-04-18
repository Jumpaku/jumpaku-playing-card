
.PHONY: docker-exec
docker-exec:
	docker compose exec work bash

.PHONY: docker-up
docker-up:
	docker compose up -d --build


.PHONY: migration
migration: ## make migration
	docker compose exec -w /workspace/backend/infra/ work migrate \
		-path ../migration \
		-database "postgres://postgres:password@postgres:5432/app?sslmode=disable" \
		up

.PHONY: master-data
master-data: ## make master-data VERSION=$(date +%s)
	@echo "VERSION: $${VERSION}"
	test "$${VERSION}" != ""
	docker compose exec -w /workspace/backend/tool/master-data work \
		go build -o bin/upsert ./cmd/upsert
	docker compose exec -w /workspace/backend/ work ./tool/master-data/bin/upsert \
		"postgres://postgres:password@postgres:5432/app?sslmode=disable" \
		master-data/tsv \
		master-data/sql/$${VERSION}
	cat ../../master-data/sql/$${VERSION}/*.sql > ../../master-data/sql/$${VERSION}.sql


.PHONY: master-data-docker
master-data-docker: ## make master-data
	cd ../tool/master-data/ && go build -o bin/upsert ./cmd/upsert

#.PHONY: psql
#psql: ## make migrate-local
#	docker compose exec -w /workspace/backend/infra/ work migrate \
#		-path migration \
#		-database "postgres://postgres:password@postgres:5432/app?sslmode=disable" \
#		up
