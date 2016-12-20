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
	IFS='/'
	REPO_SLUG_ARR=($TRAVIS_REPO_SLUG)
	unset IFS
	git push -f -q https://$REPO_SLUG_ARR:$GITHUB_API_KEY@github.com/$TRAVIS_REPO_SLUG gh-pages
fi