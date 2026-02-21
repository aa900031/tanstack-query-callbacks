import type { App, Component, ComponentInstance } from 'vue-demi'
import { createApp, defineComponent, h, Vue2 } from 'vue-demi'

export interface MountResult {
	app: App
	// eslint-disable-next-line ts/ban-ts-comment
	// @ts-expect-error
	instance: ComponentInstance
}

export type MountInitFn = (app: App) => void

const apps = new Set<App>()

export function mount<
	TComponent extends Component,
>(
	Comp: TComponent,
	init?: MountInitFn,
): MountResult {
	if ((Vue2 as any)?._installedPlugins?.length) {
		(Vue2 as any)._installedPlugins.length = 0
	}

	const AppComp = defineComponent({
		components: {
			Comp,
		},
		render() {
			return h(Comp)
		},
	})

	const app = createApp(AppComp)
	init?.(app)

	const el = document.createElement('div')
	// eslint-disable-next-line ts/ban-ts-comment
	// @ts-expect-error
	const instance = app.mount(el) as ComponentInstance

	apps.add(app)

	return {
		app,
		instance,
	}
}

export type MountSetupResult<T>
	= & MountResult
		& {
			result: T
		}

export function mountSetup<T>(
	setup: () => T,
	init?: MountInitFn,
): MountSetupResult<T> {
	let result: any

	const Comp = defineComponent({
		setup() {
			result = setup()
		},
		render() {
			return h('div', [])
		},
	})

	const mounted = mount(Comp, init)

	return {
		...mounted,
		result,
	}
}

export function cleanUp() {
	for (const app of apps) {
		app.unmount()
		apps.delete(app)
	}
}
