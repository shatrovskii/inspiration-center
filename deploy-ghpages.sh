#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
	echo "Travis should not deploy from pull requests"
  	exit 0
else
	if [ -n "$GITHUB_API_TOKEN" ]; then
		REPO=$(git config remote.origin.url)

		git clone -b ${TARGET_BRANCH} ${REPO} ${PUBLISH_DIR}

		if [ "$TRAVIS_BRANCH" == "$MASTER_BRANCH" ]; then 
			TARGET_DIR=$(mkdir -p $PUBLISH_DIR)
		else
			TARGET_DIR=$(mkdir -p $PUBLISH_DIR/$TRAVIS_BRANCH)
		fi
		
		rsync -rt --delete $SOURCE_DIR/ $TARGET_DIR/
		cd $PUBLISH_DIR
		git init
		git checkout -b $TARGET_BRANCH
		git config user.name "travis"
		git config user.email "travis"
		git add -A .
		git commit -m "Deploy to GitHub Pages"
		OWNER=`dirname $TRAVIS_REPO_SLUG`
		git push -f -q https://$OWNER:$GITHUB_API_TOKEN@github.com/$TRAVIS_REPO_SLUG $TARGET_BRANCH > /dev/null 2>&1
	fi
fi