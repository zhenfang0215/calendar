<template>
    <div 
        class="vc-header" 
        :style="gridStyle"
    >

    </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { Page, TitlePosition } from '../../utils/page'

const props = defineProps<{
    page: Page,
    layout?: string
    isLg?: boolean
    isXl?: boolean
    is2xl?: boolean
    hideTitle?: boolean
    hideArrows?: boolean
}>()

const emit = defineEmits([])


const titleLeft = computed(() => props.page.titlePosition == TitlePosition.Left)
const titleRight = computed(() => props.page.titlePosition == TitlePosition.Right)
const layout_ = computed(() => {
    if (props.layout) return props.layout;
    if (titleLeft.value) return 'tu-pn';
    if (titleRight.value) return 'pn-tu';
    return 'p-tu-n'
})
const gridStyle = computed(()=> {
    return layout_.value.split('').map(l => {
        switch (l) {
            case 'p':
                return '[prev] auto';
            case 'n':
                return '[next] auto';
            case 't':
                return '[title] auto';
            case '-':
                return '1fr';
            default:
                return '';
        }
    }).join('')
})
</script>

<style lang="css">
.vc-header {
    display: grid;
    grid-gap: 4px;
    align-items: center;
    height: 30px;
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
}
</style>