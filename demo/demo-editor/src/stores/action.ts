import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
type IModel = {
    type: Number,
    options: any
}
type IAction = { 
    type: 'add' | 'delete' | 'refresh',
    target: IModel
}
export const useActionStore = defineStore('action', () => {
  const actionList = reactive([] as IAction[])
  function addAction(act:IAction) {
    actionList.push(act)
  }
  function cancelAction(act:IAction) {
    const action = actionList.pop()
  }

  return { actionList, addAction, cancelAction }
})
