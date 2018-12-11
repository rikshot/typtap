MAKEFLAGS += -rRs

.PHONY: all release test clean setup

all:
	npx tsc --project .

release: all
	npx rollup -c --silent
	npx google-closure-compiler $(shell cat .cc.opts | xargs)

test:
	NODE_PATH=src npx ts-node --project tsconfig.test.json test/all.ts | npx tap-spec

clean:
	rm -rf build

setup: clean
	rm -rf node_modules
	rm -rf package-lock.json
	npm install
