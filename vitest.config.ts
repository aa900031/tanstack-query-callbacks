import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		svelte(),
		svelteTesting(),
	],
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
