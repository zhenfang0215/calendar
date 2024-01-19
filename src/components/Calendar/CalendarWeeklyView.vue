<template>
<div class="weekly">
    <div class="week-container">
        <template v-for="day in weekDatas">
            <calendarDay :theDay="day" mode="weekly"/>
        </template>
    </div>
    <template v-for="period in dayPeriods">
        <div>
            {{  period  }}
        </div>
    </template>
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
import { getDayPeriod } from "./CalendarWeeklyView"

let dayPeriods = getDayPeriod()

let weekDatas = ref([])

const options = {}

let calendar = new CalendarWeekly(options)

let dates = calendar.getPointWeeks()
console.log("wocao", dates)
weekDatas.value.push(...dates)

</script>