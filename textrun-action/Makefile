build:  # builds for the current platform
	echo textrun-action build ...
	${CURDIR}/../node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	echo textrun-action build artifact cleanup ...
	rm -rf dist

cuke:
cuke-lerna:

doc: build  # runs the documentation tests
	echo textrun-action documentation tests ...
	${CURDIR}/node_modules/.bin/text-run static --format=summary
	${CURDIR}/node_modules/.bin/text-run dynamic --format=progress

fix:  # runs the auto-fixers
	echo textrun-action auto-fixes ...
	${CURDIR}/../node_modules/.bin/eslint . --fix --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo textrun-action linters ...
	${CURDIR}/../node_modules/.bin/prettier -l .
	${CURDIR}/../node_modules/.bin/eslint . --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/depcheck --config=../.depcheckrc

publish: clean build  # publishes this package
	npm publish

test: lint doc  # runs all tests
test-lerna: test  # for running all tests inside Lerna

unit:

.SILENT:
