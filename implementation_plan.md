# AI 상세페이지 제작 앱 구현 계획

이 계획은 Next.js를 사용하여 AI 기반 상세페이지 제작 모바일 웹 앱을 구축하기 위한 아키텍처 및 구현 단계를 설명합니다.

## Proposed Changes

### 1. 프로젝트 초기 설정 및 기반 구조

#### [NEW] [folder structure](file:///c:/Users/LSH/Desktop/PROJECT/AIpage)
- `src/app`: Next.js App Router 기반 페이지 (Home, Editor, Preview)
- `src/components`: UI 컴포노트 (Layout, AI-Section, Editor-Tools)
- `src/lib/ai`: Gemini API 연동 모듈 (Flash, Nano 역할 분리)
- `src/types`: 상세페이지 데이터 구조 및 AI 응답 타입 정의

### 2. UI/UX 구현 (Mobile-First)

#### [NEW] [layout.tsx](file:///c:/Users/LSH/Desktop/PROJECT/AIpage/src/app/layout.tsx)
- 모바일 뷰 최적화 (Max-width 480px) 적용 및 다크 모드/라이트 모드 지원.
- 전역 폰트 및 스타일링 (Tailwind CSS) 설정.

#### [NEW] [Dashboard](file:///c:/Users/LSH/Desktop/PROJECT/AIpage/src/app/page.tsx)
- 제품 기본 정보 입력 폼 (색상, 폰트, 이미지 업로드, 참고 URL).

### 3. AI 연동 및 비즈니스 로직

#### [NEW] [gemini.ts](file:///c:/Users/LSH/Desktop/PROJECT/AIpage/src/lib/ai/gemini.ts)
- `Gemini 3.0 Flash`: 이미지/URL 분석 및 레이아웃 구조 생성 주입.
- `Gemini Nano`: 카피라이팅 및 텍스트 데이터 정제.

#### [NEW] [generator.ts](file:///c:/Users/LSH/Desktop/PROJECT/AIpage/src/lib/generator.ts)
- 분석된 데이터를 바탕으로 상세페이지 JSON 데이터 생성.

### 4. 에디터 및 미리보기 기능

#### [NEW] [Editor](file:///c:/Users/LSH/Desktop/PROJECT/AIpage/src/app/editor/page.tsx)
- 생성된 섹션별 블록 이동, 수정, 삭제 기능.
- 실시간 스타일 변경 (Color, Font).

## Verification Plan

### Automated Tests
- `npm run build`: Next.js 빌드 성공 여부 확인.
- AI 응답 파싱 테스트: Gemini API 응답이 정의된 JSON 규격을 따르는지 단위 테스트 수행.

### Manual Verification
1. **생성 흐름**: 기본 정보 입력 후 상세페이지가 섹션별로 올바르게 생성되는지 확인.
2. **AI 자산 생성**: 이미지 미첨부 시 AI가 대체 레이아웃이나 문구를 채우는지 확인.
3. **경쟁사 분석**: 참고 URL 입력 시 해당 브랜드의 느낌이 반영된 디자인이 도출되는지 확인.
4. **수정 기능**: 에디터에서 텍스트 및 스타일 수정 시 미리보기에 즉시 반영되는지 확인.
