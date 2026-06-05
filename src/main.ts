/**
 * CommonUI — Chat Space 공통 UI 컴포넌트 라이브러리
 *
 * UMD 빌드 결과물(common-ui.umd.js)을 Thymeleaf 페이지에서 CDN Vue 다음에 로드하면
 * window.CommonUI 로 접근 가능합니다.
 *
 * 사용 예:
 *   CommonUI.install();                           // 페이지 로드 후 1회 호출 필수
 *
 *   CommonUI.showLoading('저장 중...');            // 로딩 오버레이
 *   CommonUI.hideLoading();
 *
 *   const ok = await CommonUI.confirm('삭제하시겠습니까?', { type: 'danger' });
 *   await CommonUI.alert('등록이 완료되었습니다.', { type: 'success' });
 *
 *   CommonUI.toast('저장되었습니다.', { type: 'success' });
 *   CommonUI.toast('오류가 발생했습니다.', { type: 'error', duration: 5000 });
 *
 *   // Pagination 컴포넌트는 페이지 레벨 Vue 앱에서 등록하여 사용
 *   createApp({ components: { AppPagination: CommonUI.Pagination }, ... }).mount('#app');
 *   // 템플릿: <AppPagination :current-page="page" :total-pages="total" @page-change="goTo" />
 */

import './style.css';
import { createApp, type App } from 'vue';
import LoadingSpinner    from './components/LoadingSpinner.vue';
import ConfirmModal      from './components/ConfirmModal.vue';
import AlertModal        from './components/AlertModal.vue';
import ToastNotification from './components/ToastNotification.vue';
import type { ToastType } from './components/ToastNotification.vue';

// Pagination은 페이지 레벨 Vue 앱에서 컴포넌트로 등록하여 사용하므로 named export로 노출
export { default as Pagination } from './components/Pagination.vue';

// 마운트된 컴포넌트 인스턴스 참조
let spinnerInstance: InstanceType<typeof LoadingSpinner>    | null = null;
let modalInstance:   InstanceType<typeof ConfirmModal>      | null = null;
let alertInstance:   InstanceType<typeof AlertModal>        | null = null;
let toastInstance:   InstanceType<typeof ToastNotification> | null = null;

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

  // AlertModal 마운트
  const alertEl = document.createElement('div');
  alertEl.id = 'common-ui-alert';
  document.body.appendChild(alertEl);
  const alertApp: App = createApp(AlertModal);
  alertInstance = alertApp.mount(alertEl) as InstanceType<typeof AlertModal>;

  // ToastNotification 마운트
  const toastEl = document.createElement('div');
  toastEl.id = 'common-ui-toast';
  document.body.appendChild(toastEl);
  const toastApp: App = createApp(ToastNotification);
  toastInstance = toastApp.mount(toastEl) as InstanceType<typeof ToastNotification>;
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
 * @param options - 제목, 타입('default'|'danger'|'warning'), 버튼 레이블
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

/**
 * 알림 다이얼로그를 표시합니다. window.alert() 대체 API.
 * @param message - 본문 메시지
 * @param options - 제목, 타입('default'|'success'|'warning'|'error'), 버튼 레이블
 * @returns Promise<void> - 확인 버튼 클릭 후 resolve
 */
function alert(
  message: string,
  options?: {
    title?: string;
    type?: 'default' | 'success' | 'warning' | 'error';
    confirmLabel?: string;
  }
): Promise<void> {
  if (!alertInstance) return Promise.resolve();
  return alertInstance.open(message, options);
}

/**
 * 토스트 알림을 표시합니다. 지정한 duration(ms) 후 자동 사라집니다.
 * @param message  - 표시할 메시지
 * @param options  - 타입('success'|'error'|'warning'|'info'), 표시 시간(ms, 기본 3500)
 */
function toast(
  message: string,
  options?: {
    type?: ToastType;
    duration?: number;
  }
): void {
  toastInstance?.add(message, options?.type ?? 'info', options?.duration ?? 3500);
}

const CommonUI = { install, showLoading, hideLoading, confirm, alert, toast };

export { install, showLoading, hideLoading, confirm, alert, toast };
export default CommonUI;
