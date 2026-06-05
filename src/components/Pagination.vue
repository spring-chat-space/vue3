<template>
  <!-- totalPages가 1 이하면 렌더링 안 함 -->
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5">

    <!-- 이전 페이지 버튼 -->
    <button :disabled="currentPage === 0"
            @click="$emit('page-change', currentPage - 1)"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors"
            :class="currentPage === 0
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
            aria-label="이전 페이지">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>

    <!-- 페이지 번호 / 생략 기호 -->
    <template v-for="page in pageRange" :key="String(page) + (page === '...' ? Math.random() : '')">
      <span v-if="page === '...'"
            class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none">
        ...
      </span>
      <button v-else
              @click="$emit('page-change', (page as number) - 1)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
              :class="(page as number) - 1 === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
              :aria-current="(page as number) - 1 === currentPage ? 'page' : undefined">
        {{ page }}
      </button>
    </template>

    <!-- 다음 페이지 버튼 -->
    <button :disabled="currentPage >= totalPages - 1"
            @click="$emit('page-change', currentPage + 1)"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors"
            :class="currentPage >= totalPages - 1
              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
            aria-label="다음 페이지">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * 공통 페이지네이션 컴포넌트.
 * currentPage는 0-based, totalPages는 전체 페이지 수.
 * 현재 페이지 주변 ±1과 첫·마지막 페이지를 항상 표시하고, 중간 생략 시 '...'을 삽입한다.
 *
 * @emits page-change - 이동할 페이지 번호(0-based)를 payload로 전달
 */
const props = defineProps<{
  /** 현재 페이지 번호 (0-based) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
}>();

defineEmits<{
  /** 페이지 버튼 클릭 시 이동할 페이지 번호(0-based) 전달 */
  'page-change': [page: number];
}>();

/**
 * 표시할 페이지 번호(1-based) 배열을 계산합니다.
 * 생략 구간에는 '...' 문자열을 삽입합니다.
 *
 * @returns {(number | string)[]} 1-based 페이지 번호 또는 '...' 배열
 */
const pageRange = computed<(number | string)[]>(() => {
  const total = props.totalPages;
  const cur   = props.currentPage + 1; // 1-based 변환

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set(
    [1, total, cur - 1, cur, cur + 1].filter(p => p >= 1 && p <= total)
  );
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | string)[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('...');
    result.push(p);
    prev = p;
  }
  return result;
});
</script>
