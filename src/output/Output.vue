<script setup lang="ts">
import Preview from './Preview.vue'
import { Store } from '../store'
import { inject, ref, computed } from 'vue'
import type { OutputModes } from './types'
import type { EditorComponentType } from '../editor/types'

const props = defineProps<{
  editorComponent: EditorComponentType
  showCompileOutput?: boolean
  ssr: boolean
}>()

const store = inject('store') as Store
const previewRef = ref<InstanceType<typeof Preview>>()
const modes = computed(() =>
  props.showCompileOutput
    ? (['preview', 'js'] as const)
    : (['preview'] as const)
)

const mode = ref<OutputModes>(
  (modes.value as readonly string[]).includes(store.initialOutputMode)
    ? (store.initialOutputMode as OutputModes)
    : 'preview'
)

function reload() {
  previewRef.value?.reload()
}

defineExpose({ reload })
</script>

<template>
  <div class="tab-buttons">
    <button
      v-for="m of modes"
      :class="{ active: mode === m }"
      @click="mode = m"
    >
      <span>{{ m }}</span>
    </button>
  </div>

  <div class="output-container">
    <Preview ref="previewRef" :show="mode === 'preview'" :ssr="ssr" />
    <props.editorComponent
      v-if="mode !== 'preview'"
      readonly
      :filename="store.state.activeFile.filename"
      :value="store.state.activeFile.compiled[mode]"
      :mode="mode"
    />
  </div>
</template>

<style scoped>
.output-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}

.tab-buttons {
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  height: var(--header-height);
  overflow: hidden;
}
.tab-buttons button {
  padding: 0;
  box-sizing: border-box;
}
.tab-buttons span {
  font-size: 13px;
  font-family: var(--font-code);
  text-transform: uppercase;
  color: var(--text-light);
  display: inline-block;
  padding: 8px 16px 6px;
  line-height: 20px;
}
button.active {
  color: var(--color-branding-dark);
  border-bottom: 3px solid var(--color-branding-dark);
}
</style>
