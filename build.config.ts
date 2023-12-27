import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: [
		'src/index',
		'src/vue/index',
		'src/react/index',
	],
	externals: [
		'@tanstack/query-core',
		'@tanstack/vue-query',
		'@tanstack/react-query',
		'vue-demi',
		'react',
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
