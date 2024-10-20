<script setup lang="ts">
const props = defineProps({
    class: { type: String, required: false, default: '' },
    disabled: { type: Boolean, required: false, default: false }
})
</script>

<template>
    <button
        type="button"
        :class="[
            props.class,
            {
                'bg-blue-700 hover:bg-blue-800': !props.disabled,
                'bg-blue-400 cursor-not-allowed': props.disabled
            }
        ]"
        :disabled="props.disabled"
        class="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300"
    >
        <slot />
    </button>
</template>
