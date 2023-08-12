import { reactive} from 'vue'

export const sidebar = reactive({
    visible: false,
    toggle () {
        this.visible = true        
    },
    hide() {
        this.visible = false        
    }
})


  