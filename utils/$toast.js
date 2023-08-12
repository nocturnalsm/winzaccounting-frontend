import { toast } from '~/store/toast.js'

export function $toast ({ message = '', state = ''}) {
    toast.show({ message: message, state: state })
}