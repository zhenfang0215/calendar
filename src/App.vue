<script setup lang="ts">
import calendarLayout from './components/CalendarLayout.vue';
import {ref} from "vue"

const datas = ref([{
    "title": "我的 Mac 上",
    "items": [{
        "key": "家庭",
        "color": "blue"
    },{
        "key": "工作",
        "color": "gleen"
    }]
},{
    "title": "其它",
    "items": [{
        "key": "生日",
        "color": "grey"
    },{
        "key": " 中国大陆节假日",
        "color": "purple"
    },{
        "key": " Siri 建议",
        "color": "orange"
    }]
}])
</script>

<template>
    <div class="app-layout">
        <div class="layout-aside">
            <template v-for="data in datas">
                <div>{{ data.title }}</div>
                <ul>
                    <template v-for="item in data.items">
                        <li><a href="#">{{ item.key }}</a></li>
                    </template>
                </ul>
            </template>
        </div>
        <div class="layout-left">
            <div class="layout-main">
                <calendarLayout></calendarLayout>
            </div>
        </div>
    </div>
</template>

<style scoped>
.app-layout{
    width: 100%;
    height: 100%;
    position:relative;
    display: flex;
}

.layout-aside {
    flex: 1;
    opacity: 0.95;
    backdrop-filter: blur(50px); /* 模糊效果，可以根据需要调整像素值 */
    background-color: #EDEDED;
    text-align: left;
}

.layout-left {
    flex: 5;
}

.layout-main {
    height: 100%;
    background-color:cadetblue;
    padding: 0;
    overflow: unset;
    position: relative;
}
</style>