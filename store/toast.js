import { reactive} from 'vue'

export const toast = reactive({
    visible: false,
    message: '',
    state: '',
    show ({message = '', state = 'info'}) {
        this.message = message
        this.state = state
        this.visible = true
        setTimeout(() => {
            this.visible = false
        }, 3000)
    },
    hide () {
        this.visible = false
    }
})


  