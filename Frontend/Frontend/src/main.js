import { createApp } from 'vue'
import App from './views/App.vue'

import router from "./router"
import 'bootstrap/dist/css/bootstrap.css'
createApp(App).use(router).mount('#app')
