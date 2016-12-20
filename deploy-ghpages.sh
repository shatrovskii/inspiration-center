set -e

TARGET_BRANCH="gh-pages"

if [ -n "$GITHUB_API_KEY" ]; then
	cd "$TRAVIS_BUILD_DIR"
	cd dist
	git init
	git checkout -b $TARGET_BRANCH
	git add .
	git -c user.name='travis' -c user.email='travis'
	git commit -m "Deploy to GitHub Pages"
	OWNER=`dirname $TRAVIS_REPO_SLUG`
	git push -f -q https://$OWNER:$GITHUB_API_KEY@github.com/$TRAVIS_REPO_SLUG $TARGET_BRANCH > /dev/null 2>&1
	cd "$TRAVIS_BUILD_DIR"
fi