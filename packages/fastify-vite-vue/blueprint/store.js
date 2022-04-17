import { defineStore } from 'pinia'

// The main reactive data store for your app
// Pinia is the de-facto replacement for Vuex in the Vue 3 toolchain:
// It's what is offered when you bootstrap a new Vue 3 project via `npm init vue`

export const useStore = defineStore('main', {
  // https://pinia.vuejs.org/core-concepts/#using-the-store
})

// This could also be a store/ folder with multiple store files
// You'll have to import them (the useStore function) where you need them anyway

// Note: useStore is just the conventional naming for the main store.
// If you have other stores you might want to name this function
// diferently where appropriate, like useCart(), useAccount() etc
