#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
	echo "Travis should not deploy from pull requests"
  	exit 0
fi

if [ -n "$GITHUB_API_KEY" ]; then
	REPO=$(git config remote.origin.url)

	if [ "$TRAVIS_BRANCH" == "$MASTER_BRANCH" ]; then 
		mkdir -p $TARGET_DIR
	else
		mkdir -p $TARGET_DIR/$TRAVIS_BRANCH
	fi

	cd $TRAVIS_BUILD_DIR
	git clone -b ${TARGET_BRANCH} ${REPO} ${TARGET_DIR}
	rsync -rt --delete $SOURCE_DIR/ $TARGET_DIR/
	cd $TARGET_DIR
	git add -a .
	git -c user.name='travis' -c user.email='travis'
	git commit -m "Deploy to GitHub Pages"
	OWNER=`dirname $TRAVIS_REPO_SLUG`
	git push -f -q https://$OWNER:$GITHUB_API_KEY@github.com/$TRAVIS_REPO_SLUG $TARGET_BRANCH > /dev/null 2>&1
	cd $TRAVIS_BUILD_DIR
fi