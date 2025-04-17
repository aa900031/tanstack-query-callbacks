# tanstack-query-callbacks

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![coverage][coverage-src]][coverage-href]

[![npm peer dependency version - @tanstack/vue-query][peer-deps-tanstack-vue-query-src]][peer-deps-tanstack-vue-query-href]
[![npm peer dependency version - @tanstack/react-query][peer-deps-tanstack-react-query-src]][peer-deps-tanstack-react-query-href]

Use callbacks of query in the usual way, as before.

The tanstack/query has removed `onSuccess`, `onError` and `onSettled` from useQuery in v5. You can find more information in the [RFC](https://github.com/TanStack/query/discussions/5279).

# Features

- Support Tanstack/Query v4, v5
- Support Vue, React

## Instanll

```shell
// use npm
npm install tanstack-query-callbacks

// use pnpm
pnpm add tanstack-query-callbacks
```

## Usage (Vue)

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useQueryCallbacks } from 'tanstack-query-callbacks/vue'
const queryKey = ['foo']
const query = useQuery(queryKey, () => Promise.resolve('bar'))
useQueryCallbacks({
	queryKey,
	onSuccess: (data) => {
		console.log('success', data)
	},
	onError: (err) => {
		console.error('error', err)
	},
	onSettled: (data, err) => {
		console.log('settled', { data, err })
	}
})
</script>
```

## Usage (React)

```ts
import { useQuery } from '@tanstack/react-query'
import { useQueryCallbacks } from 'tanstack-query-callbacks/react'

const queryKey = ['foo']
const query = useQuery(queryKey, () => Promise.resolve('bar'))

useQueryCallbacks({
	queryKey,
	onSuccess: (data) => {
		console.log('success', data)
	},
	onError: (err) => {
		console.error('error', err)
	},
	onSettled: (data, err) => {
		console.log('settled', { data, err })
	}
})
```

<!-- Link Resources -->

[npm-version-src]: https://img.shields.io/npm/v/tanstack-query-callbacks?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/tanstack-query-callbacks
[npm-downloads-src]: https://img.shields.io/npm/dm/tanstack-query-callbacks?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/tanstack-query-callbacks
[bundle-src]: https://img.shields.io/bundlephobia/minzip/tanstack-query-callbacks?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=tanstack-query-callbacks
[coverage-src]: https://img.shields.io/codecov/c/gh/aa900031/tanstack-query-callbacks?logo=codecov&style=flat&colorA=18181B&colorB=F0DB4F
[coverage-href]: https://codecov.io/gh/aa900031/tanstack-query-callbacks
[peer-deps-tanstack-vue-query-src]: https://img.shields.io/npm/dependency-version/tanstack-query-callbacks/peer/@tanstack/vue-query?style=flat&colorA=18181B&colorB=F0DB4F
[peer-deps-tanstack-vue-query-href]: https://www.npmjs.com/package/@tanstack/vue-query
[peer-deps-tanstack-react-query-src]: https://img.shields.io/npm/dependency-version/tanstack-query-callbacks/peer/@tanstack/react-query?style=flat&colorA=18181B&colorB=F0DB4F
[peer-deps-tanstack-react-query-href]: https://www.npmjs.com/package/@tanstack/react-query
