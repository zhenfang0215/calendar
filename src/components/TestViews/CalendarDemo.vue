<template>
    <div class="calendar">
        <ul class="week-area">
            <li
                class="week-item"
                v-for="(item, index) in weekArr"
                :key="index"
            >
                {{ item }}
            </li>
        </ul>
        <ul class="data-area">
            <li 
                class="calendar-item" 
                v-for="(item, index) in dataArr" 
                :key="index"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed  } from 'vue';

const weekArr = ref(['日', '一', '二', '三', '四', '五', '六']);
const selectData = ref(0)

const getMonthDate = function() {
  this.selectData = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
}

const getMonthDataArr = function(date) {
    const {year, month, day} = date
    console.log(year, month, day)
    let datas = []
    let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31]

    // 闰年处理
    if ((year % 4 === 0 && yaer % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
    }

    const monthStartWeekDay = new Date(year, month - 1, 1).getDay(); 
    const monthEndWeekDay = new Date(year, month, 1).getDay();

    // 数据填充
    for (let i = 0; i < monthStartWeekDay; i++) {
        let emptyObj = {
            type: 'pre',
            day: '',
            month: '',
            year: ''
        }
        datas.push(emptyObj)
    }

    for (let i = 0; i < daysInMonth[month-1]; i++) {
        let itemObj = {
            type: 'normal',
            day: i+1,
            month: '',
            year: '',
            isSelected: Number(day) === i+1,
        }
        datas.push(itemObj)
    }

    for (let i = 0; i < 6-monthEndWeekDay; i++) {
        let emptyObj = {
            type: 'next',
            day: '',
            month: '',
            year: ''
        }
        datas.push(emptyObj)
    }

    return datas;
}

getMonthDate()
const da = getMonthDataArr(selectData)
const dataArr = ref(da);
console.log(da)
</script>


<style>
.calendar {
    /*隐藏超出区域的内容*/
    overflow-x: hidden;
}
.week-area {
    width: 100%;
    display: flex;
}
.week-item {
    flex: 0 0 14.285%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.data-area {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
}
.calendar-item {
    flex: 0 0 14.285%;
    display: flex;
    flex-flow: center;
}
</style>