import { createContext, createSignal, createResource, children } from 'solid-js'
import { isServer, Suspense } from 'solid-js/web'
import { Router, Routes, Route } from 'solid-app-router'

const Fragment = props => <>{children(() => props.children)}</>
const Async = isServer ? Fragment : Suspense
const DXRouteContext = createContext()

export default function DXRoute (props) {
	const ctx = props.payload.routeMap[props.path]

	ctx.state = props.state
	ctx.actions = props.payload.serverRoute.actions  

	if (isServer) {
	  ctx.layout = props.payload.serverRoute.layout ?? 'default'
	  ctx.data = props.payload.serverRoute.data
	}

	async function setup () {
		console.log('wtf')
	  if (props.payload.serverRoute.firstRender) {
	    ctx.data = props.payload.serverRoute.data
	    ctx.layout = props.payload.serverRoute.layout ?? 'default'
	    props.payload.serverRoute.firstRender = false
	    console.log('early return on firstRender')
	    return
	  }
	  ctx.layout = ctx.layout ?? 'default'
	  const { getMeta, getData, onEnter } = await ctx.loader()
	  if (getData) {
	    try {
	      const fullPath = `${location.pathname}${location.search}`
	      const updatedData = await jsonDataFetch(fullPath)
	      if (!ctx.data) {
	        ctx.data = {}
	      }
	      if (updatedData) {
	        Object.assign(ctx.data, updatedData)
	      }
	      ctx.error = null
	    } catch (error) {
	    	ctx.error = error
	    }
	  }
	  console.log('is this bloody running?')
	  if (getMeta) {
	    const updatedMeta = await getMeta(ctx)
	    if (updatedMeta) {
	    	console.log('should be working')
	      props.payload.head.update(updatedMeta)
	    }
	  }
	  if (onEnter) {
	    const updatedData = await onEnter(ctx)
	    if (updatedData) {
	      Object.assign(ctx.data, updatedData)
	    }
	  }
	}

	let element
	if (isServer) {
		element = <props.component />
	} else {
		const [routeContext] = createResource(setup)
		element = (
			<Suspense>
				{!routeContext.loading && <props.component />}
			</Suspense>
		)
	}
	return element
}
