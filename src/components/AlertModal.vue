<template>
  <!-- window.alert() 대체 단일 확인 버튼 다이얼로그 -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible"
           class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
           aria-modal="true"
           role="alertdialog">
        <div class="bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 w-full max-w-sm overflow-hidden">

          <!-- 아이콘 + 내용 -->
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   :class="iconBgClass">
                <svg v-if="type === 'error'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <svg v-else-if="type === 'warning'" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <svg v-else-if="type === 'success'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ title }}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ message }}</p>
              </div>
            </div>
          </div>

          <!-- 확인 버튼 -->
          <div class="px-6 pb-5 flex justify-end">
            <button @click="close"
                    class="px-5 py-2 text-sm font-medium text-white rounded-xl transition-colors duration-150"
                    :class="confirmBtnClass">
              {{ confirmLabel }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type AlertType = 'default' | 'success' | 'warning' | 'error';

const visible      = ref(false);
const message      = ref('');
const title        = ref('알림');
const type         = ref<AlertType>('default');
const confirmLabel = ref('확인');

// resolve 함수: open()이 반환하는 Promise의 결과를 결정
let resolvePromise: (() => void) | null = null;

const iconBgClass = computed(() => ({
  'bg-red-50':   type.value === 'error',
  'bg-amber-50': type.value === 'warning',
  'bg-green-50': type.value === 'success',
  'bg-blue-50':  type.value === 'default',
}));

const confirmBtnClass = computed(() => ({
  'bg-red-500 hover:bg-red-600':     type.value === 'error',
  'bg-amber-500 hover:bg-amber-600': type.value === 'warning',
  'bg-green-600 hover:bg-green-700': type.value === 'success',
  'bg-blue-600 hover:bg-blue-700':   type.value === 'default',
}));

/**
 * 알림 다이얼로그를 열고 확인 클릭 시 resolve되는 Promise를 반환합니다.
 * window.alert() 대체 API.
 *
 * @param msg     - 본문 메시지
 * @param options - 제목, 타입, 버튼 레이블 등 선택 옵션
 * @returns Promise<void> - 확인 버튼 클릭 후 resolve
 */
const open = (
  msg: string,
  options?: {
    title?: string;
    type?: AlertType;
    confirmLabel?: string;
  }
): Promise<void> => {
  message.value      = msg;
  title.value        = options?.title ?? '알림';
  type.value         = options?.type ?? 'default';
  confirmLabel.value = options?.confirmLabel ?? '확인';
  visible.value      = true;

  return new Promise(resolve => {
    resolvePromise = resolve;
  });
};

const close = () => {
  visible.value = false;
  resolvePromise?.();
  resolvePromise = null;
};

defineExpose({ open });
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
