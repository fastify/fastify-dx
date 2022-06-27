import Root from '/dx:root.jsx'

export default function create ({ url, payload }) {
  return () => <Root url={url} payload={payload} />
}
