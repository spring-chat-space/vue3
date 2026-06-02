/**
 * CommonUI — Chat Space 공통 UI 컴포넌트 라이브러리
 *
 * UMD 빌드 결과물(common-ui.umd.js)을 Thymeleaf 페이지에서 CDN Vue 다음에 로드하면
 * window.CommonUI 로 접근 가능합니다.
 *
 * 사용 예:
 *   CommonUI.install();              // 페이지 로드 후 1회 호출 필수
 *   CommonUI.showLoading('저장 중...');
 *   CommonUI.hideLoading();
 *   const ok = await CommonUI.confirm('삭제하시겠습니까?', { type: 'danger' });
 */

import { createApp, type App } from 'vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ConfirmModal   from './components/ConfirmModal.vue';

// 마운트된 컴포넌트 인스턴스 참조
let spinnerInstance: InstanceType<typeof LoadingSpinner> | null = null;
let modalInstance:   InstanceType<typeof ConfirmModal>   | null = null;

/**
 * 공통 UI 컴포넌트를 DOM에 마운트합니다.
 * 페이지 로드 시 반드시 1회 호출해야 합니다.
 */
function install(): void {
  // LoadingSpinner 마운트
  const spinnerEl = document.createElement('div');
  spinnerEl.id = 'common-ui-loading';
  document.body.appendChild(spinnerEl);
  const spinnerApp: App = createApp(LoadingSpinner);
  spinnerInstance = spinnerApp.mount(spinnerEl) as InstanceType<typeof LoadingSpinner>;

  // ConfirmModal 마운트
  const modalEl = document.createElement('div');
  modalEl.id = 'common-ui-modal';
  document.body.appendChild(modalEl);
  const modalApp: App = createApp(ConfirmModal);
  modalInstance = modalApp.mount(modalEl) as InstanceType<typeof ConfirmModal>;
}

/**
 * 로딩 오버레이를 표시합니다.
 * @param message - 표시할 메시지 (기본값: '처리 중...')
 */
function showLoading(message = '처리 중...'): void {
  spinnerInstance?.show(message);
}

/**
 * 로딩 오버레이를 숨깁니다.
 */
function hideLoading(): void {
  spinnerInstance?.hide();
}

/**
 * 확인 다이얼로그를 표시합니다. window.confirm() 대체 API.
 * @param message - 본문 메시지
 * @param options - 제목, 타입('default'|'danger'), 버튼 레이블
 * @returns Promise<boolean> - 확인 시 true, 취소 시 false
 */
function confirm(
  message: string,
  options?: {
    title?: string;
    type?: 'default' | 'danger';
    confirmLabel?: string;
    cancelLabel?: string;
  }
): Promise<boolean> {
  if (!modalInstance) return Promise.resolve(false);
  return modalInstance.open(message, options);
}

const CommonUI = { install, showLoading, hideLoading, confirm };

export { install, showLoading, hideLoading, confirm };
export default CommonUI;
