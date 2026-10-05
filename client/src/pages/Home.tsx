import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Link2,
  MessageCircle,
  Network,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Users,
  Wand2,
  X,
} from "lucide-react";

type Slide = {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  tag: string;
  note: string;
  visual: "cover" | "problem" | "loop" | "demo" | "questions" | "roles" | "close";
};

const baseSlides: Slide[] = [
  {
    eyebrow: "01 / AI COLLAB",
    title: "AI 협업으로\n하나의 프로젝트를 완성하기",
    accent: "판단을 나누면, 결과가 연결됩니다.",
    description: "AI에게 일을 넘기는 방법이 아니라, 사람과 AI가 질문·기준·검증을 나누는 방법을 체험합니다.",
    tag: "강의 시연",
    note: "오늘은 AI에게 일을 맡기는 방법보다, AI와 판단을 나누는 방법을 보여드리겠습니다. 참가자분들은 링크를 열고 각자 다른 주제를 넣어보셔도 됩니다.",
    visual: "cover",
  },
  {
    eyebrow: "02 / THE REAL PROBLEM",
    title: "문제는 생성 속도가 아니라\n판단의 연결입니다",
    accent: "빠른 초안보다 중요한 건 다음 판단입니다.",
    description: "AI는 초안을 빠르게 만들 수 있습니다. 하지만 무엇을 만들지, 어떻게 검증할지, 다음 작업으로 무엇을 넘길지는 사람이 연결해야 합니다.",
    tag: "핵심 관점",
    note: "AI는 초안을 빠르게 만들 수 있습니다. 하지만 무엇을 만들지, 어떤 기준으로 검증할지, 다음 작업으로 무엇을 넘길지는 사람이 연결해야 합니다.",
    visual: "problem",
  },
  {
    eyebrow: "03 / THE COLLAB LOOP",
    title: "하나의 프로젝트는\n네 가지 역할로 움직입니다",
    accent: "탐색 → 설계 → 제작 → 검증",
    description: "각 단계의 목적을 분리하면 AI를 어디에 쓰고, 사람이 무엇을 확인할지 선명해집니다.",
    tag: "협업 구조",
    note: "탐색은 문제를 좁히고, 설계는 기준을 세우고, 제작은 결과물을 만들고, 검증은 다음 판단을 준비합니다. 이 순환이 있어야 결과가 한 번 쓰고 버리는 초안이 되지 않습니다.",
    visual: "loop",
  },
  {
    eyebrow: "04 / LIVE DEMO",
    title: "이제 참가자님의 주제로\n바꿔보겠습니다",
    accent: "주제를 바꾸면, 데모의 맥락도 바뀝니다.",
    description: "아래 입력창에 원하는 프로젝트를 적어보세요. 추천 질문과 AI 답변이 그 주제에 맞춰 다시 만들어집니다.",
    tag: "직접 체험",
    note: "상단 입력창에 본인이 원하는 주제를 넣어보세요. 카페 기획이든 교육 콘텐츠든 괜찮습니다. 주제를 바꾸면 추천 질문과 답변의 맥락이 함께 바뀝니다.",
    visual: "demo",
  },
  {
    eyebrow: "05 / BETTER QUESTIONS",
    title: "AI의 첫 답은 결과물이 아니라\n다음 질문입니다",
    accent: "목적·대상·조건을 한 번에 드러내기",
    description: "초안을 바로 믿기보다, 다음 판단에 필요한 질문을 먼저 꺼내도록 설계하면 협업의 품질이 올라갑니다.",
    tag: "질문 설계",
    note: "좋은 질문은 목적, 대상, 조건을 동시에 드러냅니다. 그래서 AI가 만든 초안을 바로 믿기보다, 다음 판단에 필요한 질문을 먼저 꺼내도록 설계했습니다.",
    visual: "questions",
  },
  {
    eyebrow: "06 / HUMAN + AI",
    title: "사람은 기준을 쥐고,\nAI는 반복을 줄입니다",
    accent: "속도는 AI에게, 책임은 사람에게",
    description: "AI가 빠르게 만드는 부분과 사람이 반드시 확인해야 하는 부분을 분리하면 결과가 더 단단해집니다.",
    tag: "역할 분담",
    note: "AI가 빠르게 만드는 부분과 사람이 반드시 확인해야 하는 부분을 분리합니다. 근거, 범위, 책임이 필요한 결정은 사람의 검증 레일에 남겨둡니다.",
    visual: "roles",
  },
  {
    eyebrow: "07 / TAKEAWAY",
    title: "AI 협업은 답을 받는 기술이 아니라\n흐름을 설계하는 일입니다",
    accent: "질문 → 기준 → 결과 → 검증 → 다음 작업",
    description: "오늘의 데모를 본인 주제로 다시 실행해보세요. 링크를 공유해도 각자의 맥락으로 바로 시작할 수 있습니다.",
    tag: "마무리",
    note: "AI 협업은 한 번에 완성된 답을 받는 기술이 아닙니다. 질문을 구조화하고, 결과를 검증하고, 다음 작업으로 넘기는 흐름을 설계하는 일입니다.",
    visual: "close",
  },
];

const defaultTopic = "신규 카페 브랜드 런칭";
const defaultQuestion = "첫 주에 검증해야 할 가장 중요한 가설은 무엇인가요?";

function getTopicQuestions(topic: string) {
  const clean = topic.trim() || "나의 프로젝트";
  return [
    `${clean}의 핵심 고객은 누구인가요?`,
    `${clean}에서 먼저 검증할 가설은 무엇인가요?`,
    `${clean}의 다음 작업을 3단계로 나눠줘`,
  ];
}

function TopicMark() {
  return (
    <div className="brand-mark" aria-label="AI Collab">
      <span className="mark-orbit orbit-a" />
      <span className="mark-orbit orbit-b" />
      <span className="mark-node node-a" />
      <span className="mark-node node-b" />
      <span className="mark-link" />
      <span className="brand-word">AI COLLAB</span>
    </div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [topic, setTopic] = useState(defaultTopic);
  const [draftTopic, setDraftTopic] = useState(defaultTopic);
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const presenterMode = new URLSearchParams(window.location.search).get("presenter") === "1";
  const slide = baseSlides[current];
  const topicQuestions = useMemo(() => getTopicQuestions(topic), [topic]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setCurrent(index => Math.min(baseSlides.length - 1, index + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrent(index => Math.max(0, index - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const applyTopic = (nextTopic: string) => {
    const clean = nextTopic.trim() || defaultTopic;
    setTopic(clean);
    setDraftTopic(clean);
    setAnswer("");
    setQuestion(getTopicQuestions(clean)[0]);
  };

  const submitAnswer = async () => {
    if (!question.trim() || isThinking) return;
    setIsThinking(true);
    setAnswer("");
    try {
      const response = await fetch("/api/ai/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, question }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "AI 응답을 가져오지 못했습니다.");
      setAnswer(data.answer);
    } catch (error) {
      setAnswer(
        `현재 연결이 잠시 느립니다. 그래도 ${topic}을(를) 시작한다면, 먼저 고객과 목표를 한 문장으로 정의하고 작은 실험으로 반응을 확인해보세요. 질문을 다시 제출하면 AI 답변을 재시도할 수 있습니다.`
      );
    } finally {
      setIsThinking(false);
    }
  };

  const next = () => setCurrent(index => Math.min(baseSlides.length - 1, index + 1));
  const prev = () => setCurrent(index => Math.max(0, index - 1));
  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <TopicMark />
        <div className="topbar-right">
          <span className="live-pill"><span className="live-dot" /> LIVE DEMO</span>
          <button className="ghost-button share-button" onClick={share}>
            {copied ? <Check size={15} /> : <Link2 size={15} />}
            {copied ? "링크 복사됨" : "강의 링크 공유"}
          </button>
          {presenterMode && (
            <button className="notes-toggle" onClick={() => setShowNotes(value => !value)}>
              <Eye size={15} /> 발표자 노트
            </button>
          )}
        </div>
      </header>

      <section className="hero-layout">
        <aside className="story-rail">
          <div className="rail-label">SESSION FLOW</div>
          <div className="rail-line">
            <div className="rail-progress" style={{ height: `${((current + 1) / baseSlides.length) * 100}%` }} />
            {baseSlides.map((item, index) => (
              <button
                key={item.eyebrow}
                className={`rail-step ${index === current ? "active" : ""} ${index < current ? "done" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`${index + 1}번 슬라이드로 이동`}
              >
                <span className="rail-dot">{index < current ? <Check size={11} /> : String(index + 1).padStart(2, "0")}</span>
                <span className="rail-step-text">{item.tag}</span>
              </button>
            ))}
          </div>
          <div className="rail-caption">
            <span>YOUR CONTEXT</span>
            <strong>{topic}</strong>
          </div>
        </aside>

        <section className="deck-stage" aria-live="polite">
          <div className="deck-topline">
            <span>{slide.eyebrow}</span>
            <span>{String(current + 1).padStart(2, "0")} <i>/</i> {String(baseSlides.length).padStart(2, "0")}</span>
          </div>
          <div className={`slide-canvas slide-${slide.visual}`}>
            <div className="slide-copy">
              <div className="eyebrow"><Sparkles size={14} /> {slide.eyebrow}</div>
              <h1>{slide.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
              <p className="accent-line">{slide.accent}</p>
              <p className="slide-description">{slide.description}</p>
              {current === 0 && <div className="cover-signal"><span /> 질문을 구조화하면, 프로젝트가 움직입니다.</div>}
              {current === baseSlides.length - 1 && <button className="mini-cta" onClick={() => setCurrent(3)}><Play size={15} /> 내 주제로 다시 실행하기</button>}
            </div>
            <SlideVisual type={slide.visual} topic={topic} onGoDemo={() => setCurrent(3)} />
          </div>
          <div className="deck-controls">
            <button className="round-button" onClick={prev} disabled={current === 0} aria-label="이전 슬라이드"><ArrowLeft size={17} /></button>
            <div className="control-copy"><span>SPACE / ARROW KEYS</span><strong>{current === 3 ? "직접 주제를 바꿔보세요" : "다음 장면으로 이동"}</strong></div>
            <button className="next-button" onClick={next} disabled={current === baseSlides.length - 1}>다음 <ArrowRight size={16} /></button>
          </div>
          {presenterMode && showNotes && <div className="notes-panel"><div className="notes-heading"><span>발표자 노트</span><button onClick={() => setShowNotes(false)}><X size={15} /></button></div><p>{slide.note}</p></div>}
        </section>

        <aside className="context-panel">
          <div className="panel-header"><div><span className="panel-kicker">PARTICIPANT MODE</span><h2>내 프로젝트로<br /><em>바꿔보기</em></h2></div><div className="sparkle-badge"><Wand2 size={16} /></div></div>
          <p className="panel-description">주제를 입력하면 이 데모의 질문과 AI 답변이 해당 맥락으로 전환됩니다.</p>
          <label className="field-label" htmlFor="topic">지금 다루고 싶은 주제</label>
          <div className="topic-input-wrap"><input id="topic" value={draftTopic} onChange={event => setDraftTopic(event.target.value)} onKeyDown={event => { if (event.key === "Enter") applyTopic(draftTopic); }} /><button onClick={() => applyTopic(draftTopic)} aria-label="주제 적용"><ChevronRight size={18} /></button></div>
          <div className="topic-meta"><span><span className="status-dot" /> CONTEXT ACTIVE</span><button onClick={() => applyTopic(defaultTopic)}><RotateCcw size={12} /> 초기화</button></div>
          <div className="divider" />
          <div className="question-heading"><span>추천 질문</span><span className="question-count">03</span></div>
          <div className="suggestion-list">{topicQuestions.map(item => <button key={item} onClick={() => { setQuestion(item); setCurrent(3); }}><MessageCircle size={14} />{item}<ArrowRight size={14} /></button>)}</div>
          <div className="ai-box"><div className="ai-box-top"><span><BrainCircuit size={15} /> AI 맞춤 응답</span><span className="tiny-live">READY</span></div><textarea value={question} onChange={event => setQuestion(event.target.value)} placeholder="AI에게 물어볼 질문을 적어보세요." /><button className="ask-button" onClick={submitAnswer} disabled={isThinking || !question.trim()}>{isThinking ? <><span className="button-loader" /> 생각하는 중...</> : <><Send size={15} /> 이 주제로 답변 받기</>}</button>{answer && <div className="answer-card"><div className="answer-label"><Sparkles size={13} /> {topic}에 맞춘 답변</div><p>{answer}</p></div>}</div>
          <div className="privacy-note"><CheckCircle2 size={14} /> 로그인 없이 바로 체험 · 답변은 이 세션에만 표시됩니다</div>
        </aside>
      </section>
      <footer className="footer-bar"><span>AI COLLAB / 강의 시연용</span><span>주제를 바꾸고, 질문을 고르고, 다음 판단을 확인하세요.</span></footer>
    </main>
  );
}

function SlideVisual({ type, topic, onGoDemo }: { type: Slide["visual"]; topic: string; onGoDemo: () => void }) {
  if (type === "cover") return <div className="visual-art cover-art"><div className="art-grid" /><div className="orbit-card card-one"><BrainCircuit size={18} /><span>질문</span></div><div className="orbit-card card-two"><CheckCircle2 size={18} /><span>검증</span></div><div className="orbit-card card-three"><Users size={18} /><span>협업</span></div><div className="central-orb"><Sparkles size={28} /><span>AI</span></div><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /></div>;
  if (type === "problem") return <div className="visual-art problem-art"><div className="problem-card"><span className="mini-number">01</span><strong>생성</strong><p>초안은 빨라졌지만</p></div><div className="problem-arrow">→</div><div className="problem-card outlined"><span className="mini-number">02</span><strong>판단</strong><p>기준은 연결되어야 합니다</p></div><div className="problem-scan" /></div>;
  if (type === "loop") return <div className="visual-art loop-art"><div className="loop-center"><Network size={25} /><span>PROJECT</span></div>{[{ label: "탐색", icon: <MessageCircle size={15} /> }, { label: "설계", icon: <Wand2 size={15} /> }, { label: "제작", icon: <Play size={15} /> }, { label: "검증", icon: <CheckCircle2 size={15} /> }].map((item, index) => <div key={item.label} className={`loop-node loop-${index}`}><span>{item.icon}</span>{item.label}</div>)}<div className="loop-path" /></div>;
  if (type === "demo") return <div className="visual-art demo-art"><div className="demo-window"><div className="window-top"><span /><span /><span /><b>AI / CONTEXT SWITCH</b></div><div className="demo-window-body"><div className="demo-command"><span>TOPIC</span><strong>{topic}</strong></div><div className="demo-flow"><span className="flow-pill">질문 생성</span><ChevronRight size={14} /><span className="flow-pill mint">답변 맞춤화</span></div><button onClick={onGoDemo}><Play size={14} /> 데모 열기</button></div></div><div className="cursor-float"><span /> YOUR IDEA</div></div>;
  if (type === "questions") return <div className="visual-art questions-art"><div className="question-stack"><div className="question-card back"><span>WHY</span><b>왜 지금인가?</b></div><div className="question-card mid"><span>WHO</span><b>누구를 위한가?</b></div><div className="question-card front"><span>WHAT NEXT</span><b>다음 실험은?</b><ArrowRight size={17} /></div></div><div className="question-glow" /></div>;
  if (type === "roles") return <div className="visual-art roles-art"><div className="role-lane human"><div className="lane-title"><Users size={16} /> HUMAN</div><span>기준</span><span>범위</span><span>책임</span></div><div className="bridge"><div className="bridge-line" /><span>협업</span></div><div className="role-lane ai"><div className="lane-title"><BrainCircuit size={16} /> AI</div><span>초안</span><span>반복</span><span>변형</span></div></div>;
  return <div className="visual-art close-art"><div className="close-grid" />{["질문", "기준", "결과", "검증"].map((item, index) => <div key={item} className={`close-chip chip-${index}`}><span>0{index + 1}</span>{item}</div>)}<div className="close-center"><Sparkles size={22} /><strong>FLOW</strong></div></div>;
}
