<script lang="ts">
import { QueryClient } from '@tanstack/query-core'
import { createQuery } from '@tanstack/svelte-query'
import { useQueryCallbacks } from '../../src/svelte/index'

let {
    queryClient,
    queryKey,
    queryFn,
    onSuccess,
    onError,
    onSettled,
}: {
    queryClient: QueryClient
    queryKey: string[]
    queryFn: () => any
    onSuccess: () => void
    onError: () => void
    onSettled: () => void
} = $props()

useQueryCallbacks(() => ({
    queryClient,
    queryKey,
    onSuccess,
    onError,
    onSettled,
}))


const query = createQuery(
    () => ({
        queryKey,
        queryFn,
    }),
    () => queryClient,
)
</script>

{#if query.isError}
<p data-result="error">{query.error}</p>
{/if}
{#if query.isSuccess}
<p data-result="success">{query.data}</p>
{/if}
