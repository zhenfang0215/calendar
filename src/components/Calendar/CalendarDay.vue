<template>
    <div :class="dayClassObject">
        <div class="content">
            <div class="top_left">
                <template v-if="theDay.weekIndex == 0">
                    {{ theDay.weekNum }}
                </template>
            </div>
            <div :class="toDayClass">
                {{ theDay.date }}
            </div>
            <div class="top_right">
                日
            </div>
        </div>
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

</style>


<script setup lang="ts">
import {ref,computed, onMounted, defineProps} from 'vue'
const props = defineProps([
    'theDay'
])

const dayClassObject = computed(() => ({
    'block-size': true,
    'item': props.theDay.inMonth,
    'item-out': !props.theDay.inMonth,
    'weekend': props.theDay.weekIndex == 0 || props.theDay.weekIndex == 6
}))

const toDayClass = computed(() => ({
    'top_middle': props.theDay.isToday,
}))

// console.log(props.theDay)
</script>