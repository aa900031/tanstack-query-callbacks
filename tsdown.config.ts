import { customExports } from '@aa900031/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/vue/index.ts',
		'src/react/index.ts',
		'src/solid/index.ts',
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
		'@tanstack/vue-query',
		'@tanstack/react-query',
		'@tanstack/svelte-query',
		'@tanstack/solid-query',
		'vue-demi',
		'react',
		'svelte',
		'solid-js',
	],
})
