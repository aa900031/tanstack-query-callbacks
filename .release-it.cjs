module.exports = {
	plugins: {
		'@release-it/conventional-changelog': {
			preset: 'unjs',
			infile: 'CHANGELOG.md',
			header: '# Changelog\n\nAll notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n',
		},
	},
	git: {
		push: false,
		tagName: 'v${version}',
		commitMessage: 'chore(release): v${version}',
	},
	github: {
		release: false,
	},
	npm: {
		publish: false,
	},
}
