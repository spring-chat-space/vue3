<template>
  <!-- 전역 로딩 오버레이: body에 Teleport하여 레이아웃 구조에 무관하게 최상단 표시 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible"
           class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
           aria-live="polite"
           aria-label="로딩 중">
        <div class="bg-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl shadow-black/10 border border-gray-100">
          <div class="w-5 h-5 border-[2.5px] border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
          <span class="text-sm font-medium text-gray-600">{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const message = ref('처리 중...');

/**
 * 로딩 오버레이를 표시합니다.
 * @param msg - 표시할 메시지 (기본값: '처리 중...')
 */
const show = (msg = '처리 중...') => {
  message.value = msg;
  visible.value = true;
};

/**
 * 로딩 오버레이를 숨깁니다.
 */
const hide = () => {
  visible.value = false;
};

// 부모(CommonUI.install)에서 show/hide를 직접 호출할 수 있도록 노출
defineExpose({ show, hide });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
