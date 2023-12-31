import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, VUE_QUERY_CLIENT, VueQueryPlugin, useQuery } from '@tanstack/vue-query'
import type { RenderOptions } from '@testing-library/vue'
import { cleanup, render, waitFor } from '@testing-library/vue'
import { useQueryCallbacks } from './index'

describe('vue', () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient()
		queryClient.mount()
	})

	afterEach(() => {
		queryClient.clear()
		cleanup()
	})

	it('should call onSuccess & onSettled', async () => {
		const onSuccess = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const query = renderSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				queryFn: () => Promise.resolve('bar'),
			}, queryClient)

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClient,
				onSuccess,
				onSettled,
			})

			return result
		})

		expect(query.data.value).toBeUndefined()
		await waitFor(() => expect(query.data.value).not.toBeUndefined())

		expect(query.data.value).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith('bar', null)
	})

	it('should call onError & onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const query = renderSetup(() => {
			const result = useQuery({
				queryKey: QUERY_KEY,
				// eslint-disable-next-line prefer-promise-reject-errors
				queryFn: () => Promise.reject('bar'),
				retry: false,
			}, queryClient)

			useQueryCallbacks({
				queryKey: QUERY_KEY,
				queryClient,
				onError,
				onSettled,
			})

			return result
		})

		expect(query.error.value).toBeNull()
		await waitFor(() => expect(query.error.value).not.toBeNull())

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})

	it('should use queryClient from props.queryClientKey', () => {
		renderSetup(() => {
			useQueryCallbacks({
				queryKey: ['foo'],
				queryClientKey: VUE_QUERY_CLIENT,
			})
		}, {
			global: {
				plugins: [
					VueQueryPlugin,
				],
			},
		})
	})

	it('should use queryClient from context', () => {
		renderSetup(() => {
			useQueryCallbacks({
				queryKey: ['foo'],
			})
		}, {
			global: {
				plugins: [
					VueQueryPlugin,
				],
			},
		})
	})
})

function renderSetup<T>(
	setup: () => T,
	options?: RenderOptions,
): T {
	let result: T

	render({
		setup: () => {
			result = setup()
			return () => null
		},
	}, {
		...options,
		// eslint-disable-next-line ts/ban-ts-comment
		// @ts-expect-error
		shallow: true,
	})

	return result!
}
