import Root from '/dx:root.jsx'

export default function create ({ url, payload }) {
  // eslint-disable-next-line react/display-name
  return () => <Root url={url} payload={payload} />
}
