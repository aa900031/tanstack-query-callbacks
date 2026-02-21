import { env } from 'node:process'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		svelte({
			hot: !env.VITEST,
		}),
		svelteTesting(),
	],
	test: {
		environment: 'happy-dom',
		coverage: {
			provider: 'v8',
			include: [
				'src/**/*',
			],
		},
		outputFile: {
			junit: './test-reports/junit.xml',
		},
	},
})
