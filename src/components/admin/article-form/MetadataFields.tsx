"use client";

import { memo } from "react";
import type { ArticleEditorData } from "@/lib/article-types";
import { CoverUploader } from "./CoverUploader";
import { TagsInput } from "./TagsInput";

const CATEGORIES = ["Прогулки", "Культура", "Еда", "Активный отдых", "Развлечения"];

interface MetadataFieldsProps {
  article: ArticleEditorData;
  update: <K extends keyof ArticleEditorData>(key: K, value: ArticleEditorData[K]) => void;
  onTitleChange: (value: string) => void;
}

export const MetadataFields = memo(function MetadataFields({
  article,
  update,
  onTitleChange,
}: MetadataFieldsProps) {
  return (
    <section className="article-form__metadata">
      <div className="article-form__field article-form__field--full">
        <label htmlFor="article-title">Название статьи</label>
        <input
          id="article-title"
          value={article.title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Название новой статьи"
          className="article-form__title"
        />
      </div>
      <div className="article-form__field">
        <label htmlFor="article-slug">Slug</label>
        <input id="article-slug" value={article.slug} onChange={(event) => update("slug", event.target.value)} placeholder="url-stati" />
        <small>/blog/{article.slug || "…"}</small>
      </div>
      <div className="article-form__field">
        <label htmlFor="article-category">Категория</label>
        <select id="article-category" value={article.category} onChange={(event) => update("category", event.target.value)}>
          {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>
      <div className="article-form__field article-form__field--full">
        <label htmlFor="article-description">Краткое описание</label>
        <textarea
          id="article-description"
          value={article.description}
          onChange={(event) => update("description", event.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Анонс для карточки статьи"
        />
        <small>{article.description.length}/300</small>
      </div>
      <div className="article-form__field article-form__field--full">
        <label>Обложка</label>
        <CoverUploader value={article.image} onChange={(value) => update("image", value)} />
      </div>
      <div className="article-form__field article-form__field--full">
        <label>Теги</label>
        <TagsInput value={article.tags} onChange={(value) => update("tags", value)} />
      </div>
      <div className="article-form__field">
        <label htmlFor="article-seo-title">SEO title</label>
        <input
          id="article-seo-title"
          value={article.seoTitle}
          maxLength={60}
          onChange={(event) => update("seoTitle", event.target.value)}
          placeholder={article.title || "Заголовок для поиска"}
        />
        <small className={article.seoTitle.length > 60 ? "is-error" : ""}>{article.seoTitle.length}/60</small>
      </div>
      <div className="article-form__field">
        <label htmlFor="article-seo-description">SEO description</label>
        <textarea
          id="article-seo-description"
          value={article.seoDescription}
          maxLength={160}
          rows={3}
          onChange={(event) => update("seoDescription", event.target.value)}
          placeholder={article.description || "Описание для поисковой выдачи"}
        />
        <small className={article.seoDescription.length > 160 ? "is-error" : ""}>{article.seoDescription.length}/160</small>
      </div>
      <div className="article-form__field">
        <label htmlFor="article-status">Статус</label>
        <select
          id="article-status"
          value={article.status}
          onChange={(event) => update("status", event.target.value as ArticleEditorData["status"])}
        >
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
        </select>
      </div>
      <div className="article-form__field">
        <label htmlFor="article-date">Дата публикации</label>
        <input
          id="article-date"
          type="datetime-local"
          value={article.publishedAt}
          onChange={(event) => update("publishedAt", event.target.value)}
        />
      </div>
    </section>
  );
});
