import { QueryClient } from '@tanstack/query-core'
import { createRoot, createSignal } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQueryCallbacks } from './index'

describe('solid', () => {
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

		createRoot((dispose) => {
			useQueryCallbacks(() => ({
				queryKey: QUERY_KEY,
				queryClient,
				onSuccess,
				onSettled,
			}))

			return dispose
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

	it('should call onError & onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		createRoot((dispose) => {
			useQueryCallbacks(() => ({
				queryKey: QUERY_KEY,
				queryClient,
				onError,
				onSettled,
			}))

			return dispose
		})

		try {
			await queryClient.fetchQuery({
				queryKey: QUERY_KEY,
				// eslint-disable-next-line prefer-promise-reject-errors
				queryFn: () => Promise.reject('bar'),
				retry: false,
			})
		}
		catch {}

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})

	it('should not call callbacks after dispose', async () => {
		const onSuccess = vi.fn()
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const dispose = createRoot((dispose) => {
			useQueryCallbacks(() => ({
				queryKey: QUERY_KEY,
				queryClient,
				onSuccess,
				onError,
				onSettled,
			}))

			return dispose
		})

		dispose()

		await queryClient.fetchQuery({
			queryKey: QUERY_KEY,
			queryFn: () => Promise.resolve('bar'),
		})

		expect(onSuccess).not.toHaveBeenCalled()
		expect(onError).not.toHaveBeenCalled()
		expect(onSettled).not.toHaveBeenCalled()
	})

	it('should re-subscribe when queryKey signal changes', async () => {
		const onSuccess = vi.fn()
		const QUERY_KEY_1 = ['foo']
		const QUERY_KEY_2 = ['bar']

		const [queryKey, setQueryKey] = createSignal(QUERY_KEY_1)

		createRoot((dispose) => {
			useQueryCallbacks(() => ({
				queryKey: queryKey(),
				queryClient,
				onSuccess,
			}))

			return dispose
		})

		await queryClient.fetchQuery({
			queryKey: QUERY_KEY_1,
			queryFn: () => Promise.resolve('data1'),
		})

		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('data1')

		// Change query key signal
		setQueryKey(QUERY_KEY_2)

		await queryClient.fetchQuery({
			queryKey: QUERY_KEY_2,
			queryFn: () => Promise.resolve('data2'),
		})

		expect(onSuccess).toBeCalledTimes(2)
		expect(onSuccess).toBeCalledWith('data2')

		// Old query key should no longer trigger callback
		onSuccess.mockClear()
		await queryClient.fetchQuery({
			queryKey: QUERY_KEY_1,
			queryFn: () => Promise.resolve('data1-again'),
		})

		expect(onSuccess).not.toHaveBeenCalled()
	})

	it('should not call callbacks when no callbacks provided', async () => {
		const QUERY_KEY = ['foo']

		createRoot((dispose) => {
			useQueryCallbacks(() => ({
				queryKey: QUERY_KEY,
				queryClient,
			}))

			return dispose
		})

		// Should not throw
		await queryClient.fetchQuery({
			queryKey: QUERY_KEY,
			queryFn: () => Promise.resolve('bar'),
		})
	})
})
