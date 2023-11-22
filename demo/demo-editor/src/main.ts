import './assets/main.css'
import 'virtual:svg-icons-register'; 
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SvgIcon from './components/SvgIcons/index.vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('SvgIcon', SvgIcon);

app.use(createPinia())
app.use(router)

app.mount('#app')
