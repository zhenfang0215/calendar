<template>
<div class="container" id="container124">
    <template v-for="value in theList">
        <div class="item">{{value}}</div>
    </template>
</div>
</template>

<style>
.container {
    width: 200px;
    height: 300px;
    background-color: white;
    overflow: scroll;
}
.item {
    height: 30px;
}

</style>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { fromEvent,throttleTime } from 'rxjs';


const theList = ref([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "10",
    "20",
    "21",
    "22",
    "23",
    "24",
])

let theValue = ref(0)

onMounted(() => {
    const doc = document.getElementById("container124")
    const clicks = fromEvent(doc, 'mousewheel')
    const result = clicks.pipe(throttleTime(500))
    result.subscribe(ScrollHandle);

    doc.scrollTop = 30 * 5
})

function ScrollHandle(event) {
        var d = event.deltaY>0?'down':'up'
        const element = document.getElementById("container124");
        console.log(element.scrollTop)
        if (d === 'down') {
            // 向下
            const result = element.scrollHeight - element.clientHeight - element.scrollTop <= element.clientHeight * 0.8;
            if (result) {
                console.log("ScrollHandle down", result, element.scrollHeight,element.scrollTop,  element.clientHeight, Math.round(element.clientHeight * 0.8), element.scrollHeight - element.scrollTop - element.clientHeight)
                // for (let index = 0; index < 20; index++) {
                //     theList.value.push("next-"+ theValue.value)
                //     theValue.value ++
                // }

                
               
            }
        }else{
            // 向上
            const result = element.scrollTop <= 200;
            if (result) {
                console.log("ScrollHandle up", result, element.scrollHeight,  element.clientHeight, element.scrollTop,  element.scrollHeight - element.scrollTop - element.clientHeight, (element.scrollHeight - element.clientHeight))
                for (let index = 0; index < 20; index++) {
                    theList.value.unshift("pre-"+ theValue.value)
                    theValue.value ++
                }
                nextTick(() => {
                    console.log(element.scrollTop)
                        const top = (30*20)
                        console.log(top)
                        element.scrollTop += top
                        console.log(element.scrollTop)
                });
                
            }
        }
    }

</script>