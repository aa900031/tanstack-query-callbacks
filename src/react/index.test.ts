import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { useQueryCallbacks } from './index'

describe('react', () => {
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

		const { result } = renderHook(() => {
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

		expect(result.current.data).toBeUndefined()

		await waitFor(() => expect(result.current.data).not.toBeUndefined())

		expect(result.current.data).toBe('bar')
		expect(onSuccess).toBeCalledTimes(1)
		expect(onSuccess).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith('bar', null)
	})

	it('should call onError & onSettled', async () => {
		const onError = vi.fn()
		const onSettled = vi.fn()
		const QUERY_KEY = ['foo']

		const { result } = renderHook(() => {
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

		expect(result.current.error).toBeNull()
		await waitFor(() => expect(result.current.error).not.toBeNull())

		expect(onError).toBeCalledTimes(1)
		expect(onError).toBeCalledWith('bar')
		expect(onSettled).toBeCalledTimes(1)
		expect(onSettled).toBeCalledWith(undefined, 'bar')
	})
})
