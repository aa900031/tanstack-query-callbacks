import { customExports } from '@aa900031/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/vue/index.ts',
		'src/react/index.ts',
		'src/svelte/index.ts',
	],
	platform: 'browser',
	format: ['esm', 'cjs'],
	unbundle: true,
	exports: {
		devExports: true,
		customExports,
	},
	dts: {
		compilerOptions: {
			composite: false,
			preserveSymlinks: false,
		},
		tsconfig: './tsconfig.app.json',
	},
	external: [
		'@tanstack/query-core',
		'@tanstack/svelte-query',
		'@tanstack/vue-query',
		'@tanstack/react-query',
		'vue-demi',
		'react',
		'svelte',
	],
})
