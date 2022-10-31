import DefaultLayout from '/dx:layouts/default.jsx'

const appLayouts = import.meta.globEager('/layouts/*.(jsx|tsx)')

if (!appLayouts['/layouts/default.jsx'] && !appLayouts['/layouts/default.tsx']) {
  appLayouts['/layouts/default.jsx'] = DefaultLayout
}

export default Object.fromEntries(
  Object.keys(appLayouts).map((path) => {
    const name = path.slice(9, -4)
    return [name, appLayouts[path]]
  }),
)
