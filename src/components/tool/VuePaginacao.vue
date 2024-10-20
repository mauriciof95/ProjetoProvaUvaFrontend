<script lang="ts" setup>
import useHeroicons from '@/composables/heroicons'
import { computed, ref } from 'vue'

const props = defineProps({
    perPage: { type: Number, required: true },
    totalPage: { type: Number, required: true },
    totalRows: { type: Number, required: true },
    currentPage: { type: Number, required: true }
})

const emit = defineEmits(['pageChange'])
const { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } = useHeroicons()

const maxLinks = 5
const halfRange = Math.floor(maxLinks / 2)

const startPage = computed(() => {
    const start = props.currentPage - halfRange
    return start > 1 ? start : 1
})

const endPage = computed(() => {
    const end = props.currentPage + halfRange
    return end < props.totalPage ? end : props.totalPage
})

const pages = computed(() => {
    const pagesArray = []
    for (let i = startPage.value; i <= endPage.value; i++) {
        pagesArray.push(i)
    }
    return pagesArray
})

function pageChange(toPageNumber: number) {
    if (toPageNumber <= 0) return
    if (toPageNumber > props.totalPage) return

    emit('pageChange', toPageNumber)
}
</script>
<template>
    <ul class="flex items-center -space-x-px h-10 text-base">
        <li>
            <button
                class="link link-normal border border-e-0 rounded-s-lg"
                @click="pageChange(currentPage - 1)"
            >
                <ChevronLeftIcon class="size-4" />
            </button>
        </li>

        <li>
            <button v-if="totalPage > 3 && currentPage > 3" class="link link-disabled">
                <EllipsisHorizontalIcon class="size-4" />
            </button>
        </li>
        <template v-for="page in pages" :key="page">
            <li>
                <button
                    @click="pageChange(page)"
                    :class="{
                        'link-atual': page == currentPage,
                        'link-normal': page != currentPage
                    }"
                    class="link"
                >
                    {{ page }}
                </button>
            </li>
        </template>

        <li>
            <button v-if="endPage < totalPage" class="link link-disabled">
                <EllipsisHorizontalIcon class="size-4" />
            </button>
        </li>

        <li>
            <button class="link link-normal rounded-e-lg" @click="pageChange(currentPage + 1)">
                <ChevronRightIcon class="size-4" />
            </button>
        </li>
    </ul>
</template>
<style>
.link {
    @apply flex items-center justify-center px-4 h-10 leading-tight;
}
.link-normal {
    @apply text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700;
}
.link-disabled {
    @apply text-gray-500 bg-gray-100 border border-gray-300;
}
.link-atual {
    @apply text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700;
}
</style>
