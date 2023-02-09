export const createStore = () => {
  interface Article {
    title: string;
    content: string;
  }

  type ArticleWithId = Article & { id: string };

  let serial = 1;
  const arr: ArticleWithId[] = [];

  return {
    async getAll() {
      return arr;
    },
    async get(id: string) {
      return arr.find((article) => article.id === id) ?? null;
    },
    async create(article: Article) {
      const newArticle: ArticleWithId = { id: `${serial++}`, ...article };
      arr.push(newArticle);
      return newArticle;
    },
    async update(id: string, article: Article) {
      const target = arr.find((article) => article.id === id);
      if (!target) {
        return null;
      }

      return Object.assign(target, article, { id });
    },
    async delete(id: string) {
      const idx = arr.findIndex((article) => article.id === id);
      if (idx === -1) {
        return false;
      }
      arr.splice(idx, 1);
      return true;
    },
  };
};
