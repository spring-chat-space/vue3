<template>
  <!-- 확인 다이얼로그: window.confirm() 대체 컴포넌트 -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible"
           class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
           @click.self="cancel"
           aria-modal="true"
           role="alertdialog">
        <div class="bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 w-full max-w-sm overflow-hidden">

          <!-- 아이콘 영역 (상단 중앙) -->
          <div class="px-6 pt-8 pb-0 flex justify-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
                 :class="iconBgClass">
              <!-- 경고 아이콘 (danger) vs 기본 물음표 아이콘 -->
              <svg v-if="type === 'danger'" class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <svg v-else class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>

          <!-- 제목 + 메시지 영역 (중앙 정렬) -->
          <div class="px-6 pt-6 pb-6 text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ message }}</p>
          </div>

          <!-- 버튼 영역 -->
          <div class="px-6 pb-5 flex gap-2 justify-end">
            <button @click="cancel"
                    class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150">
              {{ cancelLabel }}
            </button>
            <button @click="confirm"
                    class="px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors duration-150"
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

/** 다이얼로그 타입 */
type ModalType = 'default' | 'danger';

const visible  = ref(false);
const message  = ref('');
const title    = ref('확인');
const type     = ref<ModalType>('default');
const confirmLabel = ref('확인');
const cancelLabel  = ref('취소');

// resolve 함수: open()이 반환하는 Promise의 결과를 결정
let resolvePromise: ((value: boolean) => void) | null = null;

const iconBgClass = computed(() =>
  type.value === 'danger' ? 'bg-red-50' : 'bg-blue-50'
);
const confirmBtnClass = computed(() =>
  type.value === 'danger'
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-blue-600 hover:bg-blue-700'
);

/**
 * 확인 다이얼로그를 열고 사용자 선택 결과(boolean)를 반환합니다.
 * window.confirm() 대체 API.
 *
 * @param msg       - 본문 메시지
 * @param options   - 제목, 타입, 버튼 레이블 등 선택 옵션
 * @returns Promise<boolean> - 확인 시 true, 취소 시 false
 */
const open = (
  msg: string,
  options?: {
    title?: string;
    type?: ModalType;
    confirmLabel?: string;
    cancelLabel?: string;
  }
): Promise<boolean> => {
  message.value      = msg;
  title.value        = options?.title ?? '확인';
  type.value         = options?.type ?? 'default';
  confirmLabel.value = options?.confirmLabel ?? '확인';
  cancelLabel.value  = options?.cancelLabel ?? '취소';
  visible.value      = true;

  return new Promise(resolve => {
    resolvePromise = resolve;
  });
};

const confirm = () => {
  visible.value = false;
  resolvePromise?.(true);
  resolvePromise = null;
};

const cancel = () => {
  visible.value = false;
  resolvePromise?.(false);
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
