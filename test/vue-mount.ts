import type { App } from 'vue-demi'
import { createApp, defineComponent, h } from 'vue-demi'

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount: () => void }

export function mount<V>(
	Comp: V,
	init?: (app: App) => void,
) {
	const app = createApp(Comp as any)
	init?.(app)

	const el = document.createElement('div')
	const comp = app.mount(el) as any as VM<V>
	comp.unmount = () => app.unmount()
	return comp
}

export function useSetup<T>(
	setup: () => T,
	init?: (app: App) => void,
) {
	const Comp = defineComponent({
		setup,
		render() {
			return h('div', [])
		},
	})

	return mount(Comp, init)
}
