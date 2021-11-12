.PHONY: empty
empty:

.PHONY: 
run:
	-docker netowrk create sckit-network
	docker-compose up

.PHONY: build
build:
	docker-compose build --no-cache

.PHONY: install
install:
	docker-compose exec sol npm install

.PHONY: bash
bash:
	docker-compose exec sol bash

.PHONY: prepare
prepare:
	docker-compose exec sol ts-node --project sckit-tsconfig.json ./libs/create_eth_account.ts
	docker-compose exec sol ts-node --project sckit-tsconfig.json ./libs/list_eth_account.ts