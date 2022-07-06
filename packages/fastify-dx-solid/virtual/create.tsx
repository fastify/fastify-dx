import Root from '/dx:root.tsx'

export default function create ({ url, payload }) {
  return () => <Root url={url} payload={payload} />
}
