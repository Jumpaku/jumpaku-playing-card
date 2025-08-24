.DEFAULT_GOAL:=help

.PHONY: help
help: ## Show this help.
	@grep -E '^[a-zA-Z_%-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%s\033[0m\n\t%s\n", $$1, $$2}'


.PHONY: protobuf
protobuf: ## make protobuf
	cd ../protobuf && \
		buf build --output bufimage.txtpb && \
		buf generate --include-imports --include-wkt bufimage.txtpb

.PHONY: pg-dao
pg-dao: ## make pg-dao POSTGRES_CONNECTION="postgres://postgres:password@localhost:5432/app?sslmode=disable"
	cd ../tool/schenerate-pg-dao && \
		go run main.go "$(POSTGRES_CONNECTION)" ../../app/src/gen/pg/dao
