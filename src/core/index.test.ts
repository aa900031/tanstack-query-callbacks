import { QueryClient } from '@tanstack/query-core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { subscribeQueryCallbacks } from './index'

describe('core', () => {
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

		subscribeQueryCallbacks({
			queryKey: QUERY_KEY,
			queryClient,
			onSuccess,
			onSettled,
		})

		await queryClient.fetchQuery({
			queryKey: QUERY_KEY,
			queryFn: () => Promise.resolve('bar'),
		})

		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith('bar', null)
	})

	it('should call onError, onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		subscribeQueryCallbacks({
			queryKey: QUERY_KEY,
			queryClient,
			onError,
			onSettled,
		})

		await queryClient.fetchQuery({
			queryKey: QUERY_KEY,
			// eslint-disable-next-line prefer-promise-reject-errors
			queryFn: () => Promise.reject('bar'),
		}).catch(() => {})

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})

	it('should not call anything when fetch other query', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const onSuccess = vi.fn()
		const QUERY_KEY = ['foo']
		const OTHER_QUERY_KEY = ['bar']

		subscribeQueryCallbacks({
			queryKey: QUERY_KEY,
			queryClient,
			onSuccess,
			onError,
			onSettled,
		})

		await queryClient.prefetchQuery({
			queryKey: OTHER_QUERY_KEY,
			// eslint-disable-next-line prefer-promise-reject-errors
			queryFn: () => Promise.reject('bar'),
		}).catch(() => {})

		expect(onSuccess).not.toBeCalled()
		expect(onError).not.toBeCalled()
		expect(onSettled).not.toBeCalled()
	})

	it('should not call anything when unsubscribed', async () => {
		const onSuccess = vi.fn()
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const unsubscribe = subscribeQueryCallbacks({
			queryKey: QUERY_KEY,
			queryClient,
			onSuccess,
			onError,
			onSettled,
		})

		unsubscribe()

		await queryClient.fetchQuery({
			queryKey: QUERY_KEY,
			queryFn: () => Promise.resolve('bar'),
		}).catch(() => {})

		expect(onSuccess).not.toBeCalled()
		expect(onError).not.toBeCalled()
		expect(onSettled).not.toBeCalled()
	})

	it('should return empty func', async () => {
		const QUERY_KEY = ['foo']

		const unsubscribe = subscribeQueryCallbacks({
			queryKey: QUERY_KEY,
			queryClient,
		})

		expect(unsubscribe).toBeTypeOf('function')
		unsubscribe()
	})
})
