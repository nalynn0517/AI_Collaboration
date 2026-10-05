import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { invokeLLM } from "./llm";

const fallbackAnswer = (topic: string) =>
  `${topic}을(를) 시작할 때는 먼저 성공을 판단할 한 가지 기준을 정하고, 가장 작은 실험으로 실제 반응을 확인해보세요. 그 결과를 바탕으로 다음 질문과 범위를 좁히면 AI가 만드는 초안도 훨씬 구체적으로 바뀝니다.`;

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  app.post("/api/ai/respond", async (req, res) => {
    const rawTopic = typeof req.body?.topic === "string" ? req.body.topic : "";
    const rawQuestion = typeof req.body?.question === "string" ? req.body.question : "";
    const topic = rawTopic.trim().slice(0, 160) || "나의 프로젝트";
    const question = rawQuestion.trim().slice(0, 500);
    if (!question) {
      return res.status(400).json({ error: "질문을 입력해주세요." });
    }
    try {
      const result = await invokeLLM({
        maxTokens: 650,
        messages: [
          {
            role: "system",
            content: `당신은 강의 시연용 AI 협업 코치입니다. 사용자의 프로젝트 주제와 질문을 바탕으로 실용적이고 검증 가능한 다음 행동을 제안하세요. 답변은 한국어로, 3개의 짧은 문단 또는 3개의 번호 목록으로 작성하세요. 첫 문장에는 핵심 판단을 말하고, 이어서 이유와 다음 실험을 제시하세요. 과장하거나 근거 없는 수치를 만들지 마세요. 프로젝트 주제: ${topic}`,
          },
          { role: "user", content: question },
        ],
      });
      const content = result.choices?.[0]?.message?.content;
      const answer = typeof content === "string" && content.trim() ? content.trim() : fallbackAnswer(topic);
      return res.json({ answer, topic });
    } catch (error) {
      console.error("AI response error", error);
      return res.json({ answer: fallbackAnswer(topic), topic, fallback: true });
    }
  });
  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
