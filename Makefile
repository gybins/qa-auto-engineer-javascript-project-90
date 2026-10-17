install:
	npm ci
	npx playwright install

dev:
	npm run dev

lint:
	npm run lint

test:
	npx playwright test