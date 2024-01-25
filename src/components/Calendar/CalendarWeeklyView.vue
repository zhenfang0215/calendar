<template>
<div class="weekly">
    <div class="week-container">
        <template v-for="day in weekDatas">
            <calendarDay :theDay="day" mode="weekly"/>
        </template>
    </div>
    <div class="timeofday">
        <template v-for="period in dayPeriods">
            <div class="time">
                {{  period  }}
            </div>
        </template>
    </div>
</div>
</template>

<style>
.weekly {
    --week-head: 8%;
    --timeofday-body: calc(100% - var(--week-head));
    height: 100%;
}

.week-container {
    display: flex;
    height: var(--week-head);
}



.timeofday {
    overflow: scroll;
    height: var(--timeofday-body);
}

.time {
    width: 100%;
    height: 5%;
    background-color: #FFFFFF;
    text-align: left;
    color: #BDBDBD;
    font-size: 15px;
    border: 1px solid #F7F7F7;
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