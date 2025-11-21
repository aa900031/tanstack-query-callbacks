import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'happy-dom',
		coverage: {
			provider: 'istanbul',
		},
		outputFile: {
			junit: './test-reports/junit.xml',
		},
	},
})
