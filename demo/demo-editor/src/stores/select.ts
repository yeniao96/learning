import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useSelectStore = defineStore('select', () => {
  const currentModel = reactive({model:{}})
  function addModel(model: object) {
    currentModel.model = model
  }

  return { currentModel, addModel }
})
