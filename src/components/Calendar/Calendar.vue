<template>
    <div class="container" id="container124">
        <div class="left_header_-1">
            <div class="add_task">
                <input type="button" value="+">
            </div>
            <div class="switch_view_type">
                <button class="monthly" @click="selectDisplayModel('dairly')">日</button>
                <button class="monthly" @click="selectDisplayModel('weekly')">周</button>
                <button class="monthly" @click="selectDisplayModel('monthly')">月</button>
                <button class="monthly" @click="selectDisplayModel('yearly')">年</button>
            </div>
            <div class="search">
                <el-input
                    class="w-50 m-2"
                    size="small"
                    placeholder="Please Input"
                    :prefix-icon="Search"
                    />
            </div>
        </div>
        
        <div :class="monthlySelectStyle">
            <div class="left_header">
                <div class="show-date">
                <p>{{theYear}}年{{theMonth}}日</p>
                </div>
                <div class="operator">
                    <el-button-group>
                        <el-button size="small" class="side buttion-size" @click="ClickPre" :icon="ArrowLeft"/>
                        <el-button size="small" class="now buttion-size" @click="ClickNow">今天</el-button>
                        <el-button size="small" class="side buttion-size" @click="ClickNext" :icon="ArrowRight"/>
                    </el-button-group>
                </div>
            </div>
            <div class="weeks">
                <template v-for="theWeek in theWeeks">
                    <div class="week-item">
                        <p>{{ theWeek.short }}</p>
                    </div>
                </template>
            </div>
            <div class="cal-container" id="caloverflow">
                <template v-for="day in fullDates">
                    <calendarDay :theDay="day" />
                </template>
            </div>
        </div>
        
        <div id="weekly-display" :class="weeklySelectStyle">
            <weeklyCalendar></weeklyCalendar>
        </div>
    </div>
</template>


<script setup lang="ts">
    import {ref,computed, onMounted, defineProps, nextTick } from 'vue'
    import {default as Calendar, IterateeContext} from '../../calendar/index.ts'
    import {
      Check,
      Delete,
      Edit,
      Message,
      Search,
      Star,
      ArrowLeft,
      ArrowRight,
    } from '@element-plus/icons-vue'
    import { default as calendarDay } from "./CalendarDay.vue";
    import { default as weeklyCalendar } from "./CalendarWeeklyView.vue"
    import { fromEvent,throttleTime } from 'rxjs';


    const props = defineProps([
        'now_month'
    ])
    
    const calendar = Calendar.create<IterateeContext>({
      // 默认周末开始
      firstWeekDay: 0,
      // 默认6周，如果周日开始
      // 那 2020-01-01 在日历视图上就是占用6行
      visibleWeeksCount: 6,
      locale: 'cn',
    })

    const calcontainerid = "caloverflow"
    const windowColumn = 7
    const windowRow = 6
    
    const theYear = ref(0)
    const theMonth = ref(0)
    const theWeeks = ref()
    const maxMonth = ref(0)
    const minMonth = ref(0)
    let fullDates = ref([])
   
    
    onMounted(() => {
        theWeeks.value = calendar.getWeekHead()
        ClickNow()
        const doc = getCalContainer()
        // doc.addEventListener('mousewheel', ScrollHandle,false)

        const clicks = fromEvent(doc, 'mousewheel')
        const result = clicks.pipe(throttleTime(400))
        result.subscribe(ScrollHandle);
    })

    // 点击当前月
    function ClickNow() {
        clickAction(now)
    }

    // 点击前一页
    function ClickPre() {
        clickAction(preMonth)
    }

    // 点击下一页
    function ClickNext() {
        clickAction(nextMonth)
    }

    // 滑动
    function ScrollHandle(event) {
        var d = event.deltaY>0?'down':'up'
        const element = getCalContainer()
        if (d === 'down') {
            // 向下
            const result = element.scrollHeight - element.clientHeight - element.scrollTop <= element.clientHeight * 0.8;
            //console.log("ScrollHandle", result, element.scrollHeight,element.scrollTop,  element.clientHeight, Math.round(element.clientHeight * 0.8), element.scrollHeight - element.scrollTop - element.clientHeight)
            if (result) {
                const max = getMaxDate()
                const next = calendar.getNextMonthCalendarByDate(max)
                console.log("xia", max, next)
                fullDates.value.push(...next)
                RefreshRowNumToCss()
            }
        }else{
            // 向上
            const result = element.scrollTop <= element.clientHeight * 0.3;
            // console.log("ScrollHandle", result, element.scrollHeight,  element.clientHeight, element.scrollTop,  element.scrollHeight - element.scrollTop - element.clientHeight, (element.scrollHeight - element.clientHeight))
            if (result) {
                const min = getMinDate()
                const pre = calendar.getPreviousMonthCalendarByDate(min)
                console.log("shang", min, pre)
                fullDates.value.unshift(...pre)
                RefreshRowNumToCss()
                const preTop = element.scrollTop
                nextTick(() => {
                    const rowHeight = GetRowHeight()
                    element.scrollTop += (5 * rowHeight + preTop)
                });
            }
        }
        const {year, month} = getCurrentMonth()
        theYear.value = year
        theMonth.value = month

    } 

    function getCalContainer():Element {
        const element = document.getElementById(calcontainerid)
        return element
    }

    function clickAction(f: Function) {
        fullDates.value = []
        f()
        const min = getMinDate()
        const pre = calendar.getPreviousMonthCalendarByDate(min)
        fullDates.value.unshift(...pre);
        const max = getMaxDate()
        const next = calendar.getNextMonthCalendarByDate(max)
        fullDates.value.push(...next)
        // console.log("RefreshFullDates", fullDates.value)
        // 刷新 css
        RefreshRowNumToCss()
        // nextTick: 确保在元素渲染完成后再执行一个函数
        nextTick(() => {
            ScrollFixedAtMiddle()
        });
    }

    function getMinDate() {
        const min = fullDates.value[0]
        console.log("min", min)
        return min
    }

    function getMaxDate() {
        const max = fullDates.value[fullDates.value.length-1]
        console.log("max", max)
        return max
    }


    // 追加上一个月
    function preMonth() {
        const min = getMinDate()
        const pre = calendar.getPreviousMonthCalendar(min.year, min.month)
        fullDates.value.unshift(...pre);
        console.log("preMonth", min.value, min.value)
        theYear.value = pre.yearNum
        theMonth.value = pre.monthNum
    }
    
    // 当前月
    function now() {
        const now = new Date()
        theYear.value = now.getFullYear()
        theMonth.value = now.getMonth() + 1
        const result = calendar.getMonthCalendar(theYear.value, theMonth.value)
        fullDates.value.push(...result)
        console.log("now", theYear.value, theMonth.value)
    }
    
    // 追加下一个月
    function nextMonth() {
        const max = getMaxDate()
        const next = calendar.getNextMonthCalendar(max.year, max.month)
        fullDates.value.push(...next)
        console.log("nextMonth", max.value, max.value)
        theYear.value = next.yearNum
        theMonth.value = next.monthNum
    }
 
    // 刷新 grid 的参数
    function RefreshRowNumToCss() {
        const element = getCalContainer();
        element.style.setProperty('--row-num', getRowNum());
    }

    // 设置滚动条位置在三个月中间的一个月
    function ScrollFixedAtMiddle() {
        const rowHeight = GetRowHeight()
        // console.log("ScrollFixedAtMiddle roweHeight", rowHeight)
        const element = getCalContainer();
        // console.log("ScrollFixedAtMiddle scrollTop", rowHeight  * 1.0 * windowRow)
        element.scrollTop = rowHeight  * 5 * 1.0 + 5; // day 单元格上下有 0.5 的 border width
    }
    

    function GetRowHeight() {
        const items = document.getElementsByClassName("item");
        if (items.length === 0) {
            return 0 
        }
        // 每个都等同,随便选择一个
        const itemConputedStyle = getComputedStyle(items[0])
        const itemHeight = itemConputedStyle.height
        console.log("item height:", itemHeight)
        const heightInPixels = parseFloat(itemHeight, 10);
        // console.log("item heightInPixels:", heightInPixels)
        return heightInPixels
    }

    function getRowNum() {
        const rowNum = fullDates.value.length / windowColumn
        console.log("Number of months:", rowNum)
        return rowNum
    }

    // 或者当前可见的年月,根据 scroll 和行列数量计算得出的
    function getCurrentMonth(): {year:number, month:number} {
        const rowNum = getRowNum()   // 目前有多少行
        // 当前在第几行
        const event = getCalContainer()
        const rowHeight = GetRowHeight()
        const whichRow = event.scrollTop / rowHeight
        console.log("getCurrentMonth",event.scrollTop, rowHeight, whichRow)
        const whichItems = Math.floor(whichRow * windowColumn + windowColumn)
        console.log("getCurrentMonth",  whichItems)
        const item = fullDates.value[whichItems]
        console.log("getCurrentMonth",  item.year, item.month,)
        return {year:item.year, month:item.month}
    }

    function selectDisplayModel(type:string) {
        styleModelMap.value.monthly = true
        styleModelMap.value.weekly = true
        styleModelMap.value.yearly = true
        styleModelMap.value.dairly = true
        if (type === "monthly") {
            styleModelMap.value.monthly = false
        }else if (type === "dairly") {
            styleModelMap.value.dairly = false
        }else if (type === "weekly") {
            styleModelMap.value.weekly = false
        }else if (type === "yearly") {
            styleModelMap.value.yearly = false
        }
        console.log("show type", type, styleModelMap.value)
    }

    const styleModelMap = ref({
        monthly: false,
        weekly: true,
        yearly: true,
        dairly: true,
    })
    const monthlySelectStyle = computed(() => ({
        'display_none': styleModelMap.value.monthly,
    }))
    const weeklySelectStyle = computed(() => ({
        'display_none': styleModelMap.value.weekly,
    }))
    const yearlySelectStyle = computed(() => ({
        'display_none': styleModelMap.value.yearly,
    }))
    const diarlySelectStyle = computed(() => ({
        'display_none': styleModelMap.value.dairly,
    }))

</script>

<style>
.b {
    background-color: aqua;
}
.show{
    display: inline;
}

.container {
    width: 100%;
    height: 100%;
    --container-header-1: 5%;
    --container-header: 8%;
    --container-header-week: 5%;
    --container-header-total: calc(var(--container-header-1) + var(--container-header) + var(--container-header-week));
    --container-body: calc(100% - var(--container-header-total));

    --workday-color: #FFFFFF;
    --workday-font-color: #272727;
    --weekend-color: #F5F5F5;
    --weekend-font-color: #B6B6B6;
    --out-month-color: #FFFFFF;
    --out-month-front-colror:  #B6B6B6;
}

.left_header_-1 {
    width: 100%;
    height: var(--container-header-1);
    background-color: blueviolet;
    display: flex;
    flex-flow: row warp;
    vertical-align: middle;
}

.add_task {
    background-color: aquamarine;
    flex: 1; 
    text-align: start;

    background-color: var(--workday-color)
}

.add_task input {
    margin-left: 8%;
    border-width: 0;
    font-weight: lighter;
}

.switch_view_type {
    flex: 1;

    display: flex;
    border-radius: 9;

    align-items: center;
    justify-content: center;

    background-color: var(--workday-color)
}
.switch_view_type button {
    width: 20%;
    height: 75%;
    margin-right: -1px;
    border-width: 1px;
    border-color: #B6B6B6;
    font-size: smaller;
    padding: 0;
}

.search {
    flex: 1 1;
    width: 2%;

    background-color: var(--workday-color)
}

.left_header {
    height: var(--container-header);

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--workday-color)
}
.show-date {
    flex: 3.5;
    font-weight: bolder;
    /* text-align: start; */
}
.show-date p {
    width: 20%;
    margin-left: 5%;
    font-weight: bolder;
    font-size: large;
}

.operator {
    padding: 5px;
    flex: 1;
    display: flex;
}

.now {
    flex: 2;
}

.side {
    flex: 1;
}

.buttion-size {
    font-size: 80px;
    border-width: 1px;
    /* border-color: black; */
    margin: 0;
}

.cal-container {
    --row-num: 6;

    width: 100%;
    height: calc(100% - var(--container-header-total));

    display: grid;
    grid-template-columns: repeat(7,14.28%);
    grid-template-rows: repeat(var(--row-num), 16.67%);
    
    /* grid-row-gap: 20px;
    grid-column-gap: 20px; */
    justify-content: stretch;

    overflow: scroll;
} 
.cal-container::-webkit-scrollbar { display: none;  }


.weeks {
    width: 100%;
    height: var(--container-header-week);

    display: inline-flex;
    background-color: var(--workday-color);
}
.week-item {
    flex: 1;
    text-align: right;
}
.week-item p {
    margin: 0;
    padding-right: 5px;
}

.display_none {
    display: none;
}

</style>

