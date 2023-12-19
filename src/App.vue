<script setup lang="ts">
import calendarLayout from './components/CalendarLayout.vue';
</script>

<template>
    <div class="app-layout">
        <div class="layout-aside">
            <div>
                我的电脑上
            </div>
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
    opacity: 0.8;
    backdrop-filter: blur(30px); /* 模糊效果，可以根据需要调整像素值 */
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