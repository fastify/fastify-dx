import DefaultLayout from '/dx:layouts/default.svelte'

const appLayouts = import.meta.globEager('/layouts/*.svelte')

appLayouts['/layouts/default.svelte'] ??= DefaultLayout

export default Object.fromEntries(
  Object.keys(appLayouts).map((path) => {
    const name = path.slice(9, -7)
    return [name, appLayouts[path]]
  }),
)
