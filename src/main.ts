import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupCalendar } from 'v-calendar'
// element UI
import 'element-plus/dist/index.css'
import ElementPlus from "element-plus";
//

const app = createApp(App)
app.use(setupCalendar, {})
app.use(ElementPlus)
app.mount('#app')
