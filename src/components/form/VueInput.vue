<script setup lang="ts">
import { ref, watch } from 'vue'
import { vMaska } from 'maska/vue'

const props = defineProps({
    modelValue: null,
    type: { type: String, required: false, default: 'text' },
    class: { type: String, required: false, default: '' },
    label: { type: String, required: false, default: '' },
    placeholder: { type: String, required: false, default: '' },
    disabled: { type: Boolean, required: false, default: false },
    vuelidate: { type: Object, required: false, default: null },
    name: { type: String, required: false, default: '' },
    step: { type: String, required: false, default: '1' },
    mask: { type: String, required: false, default: null }
})
const emit = defineEmits(['update:modelValue'])
const hasError = ref(false)
const handleInput = ($event) => {
    emit('update:modelValue', $event.target.value)
}

watch(
    () => props.vuelidate,
    () => {
        hasError.value = props.name && props.vuelidate[props.name]?.$error
    }
)
</script>

<template>
    <div>
        <label
            v-if="props.label"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            {{ props.label }}
        </label>
        <input
            v-maska="props.mask"
            :value="modelValue"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :class="[
                props.class,
                'bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            ]"
            @input="handleInput($event)"
            :step="props.type == 'number' ? props.step : null"
        />
        <div v-if="hasError">
            <span class="label-text-alt text-sm text-red-600 dark:text-red-400 pl-2">{{
                vuelidate[name].$errors[0].$message
            }}</span>
        </div>
    </div>
</template>
