import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		dir: './src',
		environment: 'happy-dom',
		coverage: {
			enabled: true,
			provider: 'istanbul',
		},
		reporters: [
			'junit',
		],
		outputFile: {
			junit: './test-reports/junit.xml',
		},
	},
})
