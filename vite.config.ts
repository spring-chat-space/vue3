import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      // window.CommonUI 로 접근 가능한 전역 변수명
      name: "CommonUI",
      // UMD 단일 포맷으로만 빌드 (ES 모듈 빌드 불필요)
      formats: ["umd"],
      fileName: () => "common-ui.umd.js",
    },
    rollupOptions: {
      // Vue는 페이지에서 CDN으로 제공되므로 번들에서 제외 (번들 용량 최소화)
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
      },
    },
    // 빌드 결과물을 WEB 프로젝트의 static/common-ui 폴더로 직접 출력
    outDir: "../chat-web-ws/chat-web/src/main/resources/static/common-ui",
    emptyOutDir: true,
  },
});
