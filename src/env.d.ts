declare module '*.svelte' {
	import type { SvelteComponent } from 'svelte'

	export default class extends SvelteComponent<any, any, any> {}
}
