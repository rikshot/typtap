MAKEFLAGS += -rRs

SRC := $(shell find src -type f)
TEST := $(shell find test -type f)

SRC_TARGETS := $(addprefix build/, $(patsubst %.ts, %.js, $(SRC)))
TEST_TARGETS := $(addprefix build/, $(patsubst %.ts, %.js, $(TEST)))

.PHONY: all release test test-integration clean setup
.NOTPARALLEL: $(SRC_TARGETS) $(TEST_TARGETS)

vpath %.ts src test

all: $(SRC_TARGETS) $(TEST_TARGETS)

build/src/%.js: src/%.ts
	npx tsc --project .

build/test/%.js: test/%.ts
	npx tsc --project .

release: $(SRC_TARGETS)
	npx rollup -c rollup.config.js --silent
	parallel --ungroup ::: \
		"npx google-closure-compiler $(shell cat .cc.es5.opts | xargs)" \
		"npx google-closure-compiler $(shell cat .cc.es6.opts | xargs)"

test:
	NODE_PATH=src npx ts-node --project tsconfig.test.json test/node.ts

test-integration: all
	npx rollup -c rollup.config.test.js --silent
	node scripts/runner.js

test-coverage: all
	npx rollup -c rollup.config.coverage.js --silent
	mkdir -p build/coverage
	node scripts/runner.js || true
	npx remap-istanbul -i build/coverage/coverage.json -o build/coverage -t html
	npx remap-istanbul -i build/coverage/coverage.json -o build/coverage/summary -t text-summary
	cat build/coverage/summary && echo '\n'

clean:
	rm -rf build

setup: clean
	rm -rf node_modules
	rm -rf package-lock.json
	npm install
