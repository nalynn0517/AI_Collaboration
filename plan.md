# AI 협업 프로젝트 시연 — 구현 계획

## 목표
강의 참가자가 링크 하나로 접속해 원하는 주제를 입력하고, 그 주제에 맞는 추천 질문과 AI 답변을 즉시 체험한다. 발표자는 같은 페이지를 발표용 웹 슬라이드로 넘기며 설명하고, `?presenter=1` 모드에서만 발표 대본을 확인한다.

## 디자인 결정
- **Design Movement**: Editorial dashboard + kinetic typography. 강의 자료의 구조감과 데모 제품의 반응성을 결합한다.
- **Core Principles**: 한 화면 한 메시지, 짧은 카피, 명확한 진행감, 직접 조작하는 데모.
- **Color Philosophy**: 잉크 네이비(#0b1220)로 집중감을 만들고, 민트(#55e5c0)와 라일락(#a78bfa)으로 AI의 활력과 협업의 층위를 강조한다.
- **Layout Paradigm**: 중앙 정렬 카드가 아니라 왼쪽의 서사 레일과 오른쪽의 증거 패널이 맞물리는 split-stage 구조를 사용한다.
- **Signature Elements**: 진행 레일, 유리 질감 카드, 커서·노드·브리지 모티프.
- **Interaction Philosophy**: 참가자가 주제를 바꾸면 추천 질문·답변·슬라이드의 예시가 같은 컨텍스트로 재구성된다.
- **Animation**: 슬라이드 전환은 짧은 fade/slide, 답변 생성은 단계별 pulse, 장식은 느린 float만 사용한다.
- **Typography**: Pretendard 계열의 시스템 한글 폰트와 짧은 영문 eyebrow. 제목은 굵고 크게, 본문은 16–18px로 제한한다.
- **Brand Essence**: AI에게 일을 넘기는 것이 아니라 판단 구조를 함께 만드는 강의 시연. 성격은 선명함·실용성·참여형.
- **Brand Voice**: “AI가 답을 내는 곳이 아니라, 다음 판단을 더 잘하게 만드는 곳.” / “주제를 바꾸면 데모의 맥락도 함께 바뀝니다.”
- **Wordmark & Logo**: 두 개의 점과 연결선이 만드는 작은 브리지 심볼 + AI COLLAB 워드마크.
- **Signature Brand Color**: electric mint #55E5C0.

## 프로젝트 구조
- `client/src/pages/Home.tsx`: 인터랙티브 슬라이드, 주제 컨텍스트, 발표자 노트 UI.
- `client/src/index.css`: 시각 언어, 반응형 레이아웃, 애니메이션.
- `server/_core/index.ts`: `/api/ai/respond` AI 응답 엔드포인트와 health route.
- `client/public/manus-routes.json`: 공개 라우트 선언.
- `PRESENTER_NOTES.md`: 슬라이드별 발표 대본 원문.

## 구현 선택
- 로그인 없이 공개 접근한다.
- 서버에서 내장 LLM을 호출해 추천 질문과 답변을 생성한다.
- AI 실패 시에도 시연이 끊기지 않도록 입력 주제 기반의 정중한 fallback을 제공한다.
- 참가자용 기본 모드에는 발표 대본을 숨기고, 발표자가 `?presenter=1`로 들어왔을 때만 대본을 표시한다.
