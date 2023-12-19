<template>
    <!-- <input id="darkmode" type="checkbox" v-model="isDark"/>
    <label for="darkmode"> Dark Mode </label>

    <input id="expanded" type="checkbox" v-model="expanded" />
    <label for="expanded"> expanded </label>

    <div></div>
    <span> showWeekNumbers </span>
    <select v-model="showWeekNumbers">
        <option disabled value="">Please select one</option>
        <option>left</option>
        <option>left-outside</option>
        <option>left</option>
        <option>right-outside</option>
    </select>
    <button draggable="true">hello</button>
    <div ondragover="console.log('here');">{}</div>
    
    <br/>
    <Calendar
        :expanded="expanded"
        :show-weeknumbers="showWeekNumbers"
        title-position="left"
        :color="selectedColor"
        :attributes="attrs" 
        :is-dark="isDark"
        
    ></Calendar> -->
   <!-- <DatePicker 
        v-model.range="range"
        :expanded="expanded"
        :show-weeknumbers="showWeekNumbers"
        title-position="left"
        :color="selectedColor"
        :attributes="attrs" 
        :is-dark="isDark"
        :select-attribute="selectDragAttribute"
        :drag-attribute="selectDragAttribute"

        @drag="dragValue=$event;console.log($event)"
   >
        <template #day-popver="{ format }">
            <div    class="text-sm">
                {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
                -
                {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
            </div>
        </template>
    </DatePicker> -->
   
   <MyCalendar></MyCalendar>
   <!-- <testOverFlow></testOverFlow> -->
   
   
</template>


<script setup lang="ts">
import testOverFlow from './Calendar/TestOverflow.vue';
import { Calendar, DatePicker } from 'v-calendar'
import { default as MyCalendar } from './Calendar/Calendar.vue'
import 'v-calendar/style.css'
import { ref,computed  } from 'vue';

const expanded = ref(true)
const showWeekNumbers = ref("")
const isDark = ref(false)
const date = new Date()
const selectedColor = ref('blue');
const attrs = ref([
  {
    key: 'test',
    highlight: true,
    dates: [{ start: new Date(2023, 10, 29), end: new Date(2023, 10, 31) }],
  }
]);
const range = ref({
    start: new Date(2023, 10,15),
    end: new Date(2023, 10,19),
})
const dragValue = ref(null)
const selectDragAttribute = computed(() => ({
    popover: {
        visibility: 'hover',
        isInteractive: false
    }
}))
</script>


<style>
.slot-container {
    width: 10em;
    height: 8em
}

.vc-container .vc-weekday-1, .vc-container .vc-weekday-7 {
    color: #6366f1;
}

</style>


