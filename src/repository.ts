export interface Article {
  title: string;
  content: string;
  author: string;
}

export interface ArticleRepository {
  getArticle(): Promise<Article>;
}
