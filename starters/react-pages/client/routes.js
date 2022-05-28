import { createRoutes } from '/temp'

// If you want to have the directory
// structure define your routes:
export default createRoutes({
  from: import.meta.glob('/pages/**/*.jsx'),
  param: /\[(\w+)\]/,
})

// If you want to export `path` from 
// your components to define your routes:
// export default createRoutes({
//   from: import.meta.glob('/views/**/*.jsx'),
//   path: ({ component }) => component.path,
// })
