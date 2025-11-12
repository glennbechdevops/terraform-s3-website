import { ExternalLink } from 'lucide-react';
import type { NewsArticle } from '../types/crypto';

interface NewsCardProps {
  article: NewsArticle;
  index?: number;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-flat p-4 flex gap-4 hover:border-mono-900 cursor-pointer transition-colors group"
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-medium text-sm text-mono-900 line-clamp-2">
            {article.title}
          </h4>
          <ExternalLink size={14} className="flex-shrink-0 text-mono-400 group-hover:text-mono-900 transition-colors" />
        </div>

        <p className="text-xs text-mono-500 line-clamp-2 mb-2">
          {article.body}
        </p>

        <div className="flex items-center gap-3 text-xs text-mono-400">
          <span className="font-medium text-mono-600">{article.source}</span>
          {article.categories && (
            <span className="border-l border-mono-200 pl-2">{article.categories.split('|')[0]}</span>
          )}
        </div>
      </div>
    </a>
  );
}
