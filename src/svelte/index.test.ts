import { QueryClient } from '@tanstack/query-core'
import { useQueryClient } from '@tanstack/svelte-query'
import { render, waitFor } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Basic from '../../test/svelte/Basic.svelte'

describe('svelte', () => {
	let queryClient: QueryClient
	let queryKey: any

	beforeEach(() => {
		queryClient = new QueryClient()
		queryClient.mount()
		queryKey = ['test-query']
	})

	afterEach(() => {
		queryClient.clear()
	})

	describe('useQueryCallbacks', () => {
		it('should call onSuccess and onSettled callbacks when query succeeds', async () => {
			const onSuccess = vi.fn()
			const onSettled = vi.fn()
			const queryFn = vi.fn().mockResolvedValue('data')

			render(Basic, {
				queryClient,
				onSuccess,
				onSettled,
				queryKey,
				queryFn,
			})

			await waitFor(() => {
				expect(onSuccess).toHaveBeenCalledTimes(1)
				expect(onSuccess).toHaveBeenCalledWith('data')
				expect(onSettled).toHaveBeenCalledTimes(1)
				expect(onSettled).toHaveBeenCalledWith('data', null)
			})
		})

		it('should call onError and onSettled callbacks when query fails', async () => {
			const onError = vi.fn()
			const onSettled = vi.fn()
			const queryFn = vi.fn().mockRejectedValue('error')

			render(Basic, {
				queryClient,
				onError,
				onSettled,
				queryKey,
				queryFn,
			})

			await waitFor(() => {
				expect(onError).toHaveBeenCalledTimes(1)
				expect(onError).toHaveBeenCalledWith('error')
				expect(onSettled).toHaveBeenCalledTimes(1)
				expect(onSettled).toHaveBeenCalledWith(undefined, 'error')
			})
		})

		it('should not call callbacks after unsubscribe', async () => {
			const onSuccess = vi.fn()
			const onError = vi.fn()
			const onSettled = vi.fn()
			const queryFn = vi.fn().mockResolvedValue('data')

			const { unmount } = render(Basic, {
				queryClient,
				onSuccess,
				onError,
				onSettled,
				queryKey,
				queryFn,
			})

			unmount()

			const queryClientInstance = useQueryClient(queryClient)
			await queryClientInstance.fetchQuery({
				queryKey,
				queryFn,
			})

			await waitFor(() => {
				expect(onSuccess).not.toHaveBeenCalled()
				expect(onError).not.toHaveBeenCalled()
				expect(onSettled).not.toHaveBeenCalled()
			})
		})
	})
})
