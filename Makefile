test:
	@./node_modules/.bin/mocha -u bdd --reporter spec

.PHONY: test