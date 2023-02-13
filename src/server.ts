import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { z } from "zod";
import { createStore } from "./store";

const articleSchema = z.object({ title: z.string(), content: z.string() });
const articleWithIdSchema = z.intersection(
  z.object({ id: z.string() }),
  articleSchema
);

const articleStore = createStore();

export const t = initTRPC.meta<OpenApiMeta>().create();
export const appRouter = t.router({
  getArticleList: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/article",
        summary: "모든 게시글 보기",
        tags: ["article"],
      },
    })
    .input(z.void())
    .output(z.array(z.object({ id: z.string(), title: z.string() })))
    .query(async (req) => {
      return await articleStore.getAll();
    }),
  getArticle: t.procedure
    .meta({
      openapi: {
        method: "GET",
        path: "/article/{articleId}",
        summary: "게시글 보기",
        tags: ["article"],
      },
    })
    .input(z.object({ articleId: z.string() }))
    .output(articleSchema)
    .query(async (req) => {
      const id = req.input.articleId;
      const article = await articleStore.get(id);

      if (!article) {
        throw new TRPCError({
          message: `ID=${id} 에 대한 게시글이 없습니다.`,
          code: "NOT_FOUND",
        });
      }

      return article;
    }),
  createArticle: t.procedure
    .meta({
      openapi: {
        method: "POST",
        path: "/article",
        summary: "게시글 쓰기",
        tags: ["article"],
      },
    })
    .input(articleSchema)
    .output(articleWithIdSchema)
    .mutation(async (req) => {
      const article = await articleStore.create(req.input);
      return article;
    }),
  updateArticle: t.procedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/article/{articleId}",
        summary: "게시글 수정",
        tags: ["article"],
      },
    })
    .input(z.object({ articleId: z.string(), article: articleSchema }))
    .output(articleWithIdSchema)
    .mutation(async (req) => {
      const article = await articleStore.update(
        req.input.articleId,
        req.input.article
      );

      if (!article) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return article;
    }),
  deleteArticle: t.procedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/article/{articleId}",
        summary: "게시글 삭제",
        tags: ["article"],
      },
    })
    .input(z.object({ articleId: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async (req) => {
      const result = await articleStore.delete(req.input.articleId);

      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        success: true,
      };
    }),
});

export type AppRouter = typeof appRouter;
