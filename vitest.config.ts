import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		root: './src',
		environment: 'happy-dom',
	},
})
