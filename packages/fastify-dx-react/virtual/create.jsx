import Root from '/dx:root.jsx'
import Default from '/dx:layouts/default.jsx'

export default function create ({ url, ...serverInit }) {
  return (
    <Default>
      <Root url={url} serverInit={serverInit} />
    </Default>
  )
}
