import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: [
		'src/index',
		'src/vue/index',
	],
	externals: [
		'@tanstack/query-core',
		'@tanstack/vue-query',
		'vue-demi',
	],
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
		dts: {
			respectExternal: true,
			compilerOptions: {
				composite: false,
				preserveSymlinks: false,
			},
			tsconfig: './tsconfig.app.json',
		},
	},
})
