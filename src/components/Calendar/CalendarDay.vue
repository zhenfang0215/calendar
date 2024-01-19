<template>
    <div :class="dayClassObject">
        <template v-if="mode == 'daily'">
            <div :class="contentClassObject">
                <div class="top_left">
                    <template v-if="theDay.weekIndex == 0">
                        {{ theDay.weekNum }}
                    </template>
                </div>
                <template v-if="theDay.date == 1">  <!--每个月第一天-->
                    <div class="monthPrompt">
                        {{theDay.year}}-{{theDay.month}}
                    </div>
                </template>
                <div :class="toDayClass">
                    <!-- {{theDay.year}}-{{theDay.month}}-{{ theDay.date }} -->
                    {{theDay.month}}-{{ theDay.date }}
                    <!-- {{theDay.date}} -->
                </div>
                <div class="top_right">
                    日
                </div>
            </div>
        </template>
        <template v-else-if="mode == 'weekly'">
            <div :class="contentClassObject">
                <div class="top_left">
                    <template v-if="theDay.weekIndex == 0">
                        {{ theDay.weekNum }}
                    </template>
                </div>
                <template v-if="theDay.date == 1">  <!--每个月第一天-->
                    <div class="monthPrompt">
                        {{theDay.year}}-{{theDay.month}}
                    </div>
                </template>
                <div :class="toDayClass">
                    <!-- {{theDay.year}}-{{theDay.month}}-{{ theDay.date }} -->
                    {{theDay.month + 1}}-{{ theDay.date }}
                    <!-- {{theDay.date}} -->
                </div>
                <div class="top_right">
                   <template v-if="theDay.week === 0">
                     周日
                   </template>
                   <template v-else>
                     周 {{ theDay.week }}
                   </template>
                </div>
            </div>
        </template>
    </div>
</template>

<style>

.content {
    height: 30%;
    display: flex;
    padding: 3% 10%;
}

.content .top_left {
    flex: 4;
    text-align: start;
}

.block-size {
    border: 0.5px solid #E6E6E6;
    text-align: center;
}

.item {
    color: var(--workday-fontday-font-color);
    background-color: var(--workday-color);
}

.item-out {
    color: var(--out-month-front-colror);
    background-color: var(--out-month-color)
}

.weekend {
    color: var(--weekend-font-color);
    background-color:var(--weekend-color);
}


.top_middle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: #FF3B31;
    color: white;
    font-weight: bold;
    line-height: 26px;
}

.monthPrompt {
    position: sticky;
    left: 0px;
    background-color:aqua ;
}

/*  
weekly view
*/

.week-content {
    flex: 1;
}

</style>


<script setup lang="ts">
import {ref,computed, onMounted, defineProps} from 'vue'
const props = defineProps([
    'theDay',
    'mode'
])

const dayClassObject = computed(() => ({
    'block-size': true,
    'item': props.theDay.inMonth,
    'item-out': !props.theDay.inMonth,
    'weekend': props.theDay.weekIndex == 0 || props.theDay.weekIndex == 6,
    'week-content': props.mode === "weekly"
}))

const contentClassObject = computed(() => ({
    'content': props.mode === "daily",
}))

const toDayClass = computed(() => ({
    'top_middle': props.theDay.isToday,
}))

// console.log(props.theDay)
</script>