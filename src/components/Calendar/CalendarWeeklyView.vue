<template>
<div class="weekly">
    <div class="week-container">
        <template v-for="day in weekDatas">
            <calendarDay :theDay="day" />
        </template>
    </div>
</div>
</template>

<style>
.week-container {
    display: flex;
}


</style>


<script setup lang="ts">
import { CalendarWeekly } from '../../calendar/core/calendar-weekly.ts'
import { default as calendarDay } from "./CalendarDay.vue";
import { ref } from 'vue'

let weekDatas = ref([])

const options = {}

let calendar = new CalendarWeekly(options)

let dates = calendar.getPointWeeks()
console.log("wocao", dates)
weekDatas.value.push(...dates)

</script>