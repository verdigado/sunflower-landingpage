compile:
	npm run compile:css

compile-silent:
	npm run compile:build

watch:
	npm run watch

bundle:
	npm run build && npm run bundle

deploy:
	git push && make compile-silent bundle upload activate

publish:
	@echo "Latest tag was: "
	@git describe --tags --abbrev=0
	@read -p "which version do you want to publish now (start with number, NO v): " newversion; \
	sed -i  "s/Version.*/Version:\ $$newversion/" "sass/style.scss" && \
	php create-changelog.php $$newversion && \
	git checkout -B deploy && \
	git add sass/style.scss changelog.html && git commit -m "publishing version $$newversion" && \
	git push --set-upstream origin deploy

changelog:
	php create-changelog.php

change-since-last-tag:
	git log --pretty=format:"%s" HEAD...$(shell git describe --tags --abbrev=0)
