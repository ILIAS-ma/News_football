'use client';

import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/lib/api';
import Image from 'next/image';

export default function Home() {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Une erreur est survenue lors du chargement des articles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles?.map((article: any) => (
        <article key={article.id_article} className="bg-white rounded-lg shadow-md overflow-hidden">
          {article.image && (
            <div className="relative h-48 w-full">
              <Image
                src={`https://newsfootbackend-production.up.railway.app/src/${article.image}`}
                alt={article.titre}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{article.titre}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Par {article.auteur_prenom} {article.auteur_nom} • {new Date(article.date_creation).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-gray-700 line-clamp-3">{article.contenu}</p>
            <div className="mt-4">
              <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm">
                {article.categorie}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 