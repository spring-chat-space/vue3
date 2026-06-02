# chat-vue

Chat Space 공통 UI 컴포넌트 라이브러리입니다.  
Vue 3로 작성된 컴포넌트를 **UMD 단일 파일**로 빌드하여 Thymeleaf 페이지에서 script 태그로 사용합니다.

## 제공 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `LoadingSpinner` | 전체 화면 로딩 오버레이 |
| `ConfirmModal` | `window.confirm()` 대체 다이얼로그 |

## 빌드 및 배포

```bash
npm install
npm run build
```

빌드 후 `common-ui.umd.js`가 아래 경로로 자동 출력됩니다.

```
../chat-web-ws/chat-web/src/main/resources/static/common-ui/common-ui.umd.js
```

chat-web 서버를 재시작하면 즉시 반영됩니다.

## 페이지에서 사용하는 법

```html
<!-- Vue·axios는 별도 vendor 파일로 로드 (캐시 분리) -->
<script src="/vendor/vue.global.prod.js"></script>
<script src="/vendor/axios.min.js"></script>
<!-- 공통 컴포넌트 라이브러리 -->
<script src="/common-ui/common-ui.umd.js"></script>

<script>
  // 페이지 로드 시 1회 초기화 필수
  CommonUI.install();

  // 로딩 오버레이
  CommonUI.showLoading('저장 중...');
  CommonUI.hideLoading();

  // 확인 다이얼로그 (Promise 반환)
  const ok = await CommonUI.confirm('삭제하시겠습니까?', { type: 'danger' });
</script>
```

## 기술 스택

| 항목 | 버전 |
|------|------|
| Vue | 3.5.x |
| Vite | 6.x |
| TypeScript | 5.7.x |
| vue-tsc | 2.x |

## 라이브러리 추가 방법

다른 npm 라이브러리를 컴포넌트 내부에서만 사용할 경우 `package.json`에 추가 후 빌드하면 번들에 포함됩니다.  
단, Vue처럼 페이지 전역에서 사용하는 라이브러리는 `vite.config.ts`의 `external`에 등록하고 `vendor/`에 별도 파일로 추가하세요.

## 스크립트

```bash
npm run dev      # 개발 서버 (컴포넌트 단독 확인용)
npm run build    # UMD 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```
