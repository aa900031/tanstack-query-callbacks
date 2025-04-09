import { QueryClient, VueQueryPlugin, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { App } from 'vue-demi'
import { createApp, defineComponent, h } from 'vue-demi'
import { waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQueryCallbacks } from './index'

describe('vue', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient()
		queryClient.mount()
	})

	afterEach(() => {
		queryClient.clear()
	})

	it('should call onSuccess & onSettled', async () => {
		const onSuccess = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const query = useQueryClientSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				onSuccess,
				onSettled,
			})

			return result
		}, {
			queryClient,
		})

		expect(query.data).toBeUndefined()
		await waitFor(() => expect(query.data).not.toBeUndefined())

		expect(query.data).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith('bar', null)
	})

	it('should call onError & onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const query = useQueryClientSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				// eslint-disable-next-line prefer-promise-reject-errors
				queryFn: () => Promise.reject('bar'),
				retry: false,
			})

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				onError,
				onSettled,
			})

			return result
		}, {
			queryClient,
		})

		expect(query.error).toBeNull()
		await waitFor(() => expect(query.error).not.toBeNull())

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})

	it('should call onSuccess with custom QueryClient', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']

		const query = useQueryClientSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			}, queryClient)

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClient,
				onSuccess,
			})

			return result
		})

		expect(query.data).toBeUndefined()
		await waitFor(() => expect(query.data).not.toBeUndefined())

		expect(query.data).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
	})

	it('should call onSuccess with `queryClientId`', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']
		const queryClientId = 'custom-key'

		const query = useQueryClientSetup(() => {
			const queryClient = useQueryClient(queryClientId)
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			}, queryClient)

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClientId,
				onSuccess,
			})

			return result
		}, {
			queryClientKey: queryClientId,
		})

		expect(query.data).toBeUndefined()
		await waitFor(() => expect(query.data).not.toBeUndefined())

		expect(query.data).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
	})
})

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount: () => void }

function mount<V>(
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

function useSetup<T>(
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

function useQueryClientSetup<T>(
	setup: () => T,
	options?:
		| { queryClient: QueryClient }
		| { queryClientKey: string },
) {
	return useSetup<T>(setup, (app) => {
		if (options)
			app.use(VueQueryPlugin, options)
	})
}
