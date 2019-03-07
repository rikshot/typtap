MAKEFLAGS += -rRs

SRC := $(shell find src -type f)
TEST := $(shell find test -type f)

SRC_TARGETS := $(addprefix build/, $(patsubst %.ts, %.js, $(SRC)))
TEST_TARGETS := $(addprefix build/, $(patsubst %.ts, %.js, $(TEST)))

.PHONY: all release publish test test-integration test-coverage clean setup lint
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
		"npx google-closure-compiler $(shell cat .cc.umd.opts | xargs)" \
		"npx google-closure-compiler $(shell cat .cc.esm.opts | xargs)"

publish: release
	mkdir -p types
	cp build/src/*.d.ts types/

test: all
	NODE_PATH=src npx ts-node --project tsconfig.test.json test/node.ts | npx tap-spec

test-integration: all release
	npx rollup -c rollup.config.integration.js --silent
	node scripts/runner.js integration | npx tap-spec

test-coverage: all
	npx rollup -c rollup.config.coverage.js --silent
	mkdir -p build/coverage
	node scripts/runner.js coverage | npx tap-spec
	npx remap-istanbul -i build/coverage/coverage.json -o build/coverage -t html
	npx remap-istanbul -i build/coverage/coverage.json -o build/coverage/summary -t text-summary
	cat build/coverage/summary && echo '\n'

clean:
	rm -rf build

setup: clean
	rm -rf node_modules
	rm -rf package-lock.json
	npm install

lint:
	npx tslint -p .
