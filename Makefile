.PHONY: empty
empty:

.PHONY: 
run:
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