<template>
  <!-- 우측 상단에 스택으로 쌓이는 토스트 알림 -->
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[9997] flex flex-col gap-2.5 pointer-events-none"
         aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id"
             class="pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3.5 shadow-xl text-sm min-w-[260px] max-w-[380px] border"
             :class="config[t.type].wrap">

          <!-- 타입별 아이콘 -->
          <div class="w-5 h-5 flex-shrink-0 mt-0.5" :class="config[t.type].icon">
            <svg v-if="t.type === 'success'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else-if="t.type === 'error'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else-if="t.type === 'warning'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <span class="flex-1 leading-relaxed font-medium" :class="config[t.type].text">{{ t.message }}</span>

          <!-- 닫기 버튼 -->
          <button @click="remove(t.id)"
                  class="flex-shrink-0 p-0.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                  :class="config[t.type].close"
                  aria-label="닫기">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

/** 타입별 Tailwind 클래스 매핑 */
const config: Record<ToastType, { wrap: string; icon: string; text: string; close: string }> = {
  success: {
    wrap:  'bg-green-50 border-green-200',
    icon:  'text-green-500',
    text:  'text-green-800',
    close: 'text-green-600',
  },
  error: {
    wrap:  'bg-red-50 border-red-200',
    icon:  'text-red-500',
    text:  'text-red-800',
    close: 'text-red-600',
  },
  warning: {
    wrap:  'bg-amber-50 border-amber-200',
    icon:  'text-amber-500',
    text:  'text-amber-800',
    close: 'text-amber-600',
  },
  info: {
    wrap:  'bg-blue-50 border-blue-200',
    icon:  'text-blue-500',
    text:  'text-blue-800',
    close: 'text-blue-600',
  },
};

/**
 * 토스트 알림을 추가하고 duration 후 자동 제거합니다.
 *
 * @param message  - 표시할 메시지
 * @param type     - 알림 종류 (success | error | warning | info)
 * @param duration - 자동 제거까지의 밀리초 (기본값: 3500)
 */
function add(message: string, type: ToastType = 'info', duration = 3500): void {
  const id = nextId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => remove(id), duration);
}

/**
 * 특정 id의 토스트를 즉시 제거합니다.
 *
 * @param id - 제거할 토스트 id
 */
function remove(id: number): void {
  const idx = toasts.value.findIndex(t => t.id === id);
  if (idx !== -1) toasts.value.splice(idx, 1);
}

defineExpose({ add });
</script>

<style scoped>
.toast-enter-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.toast-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.toast-move {
  transition: transform 0.22s ease;
}
</style>
