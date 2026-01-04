'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, User, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: any;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { data: session, status } = useSession();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [topComments, setTopComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [article.id]);

  const fetchData = async () => {
    try {
      const [likesRes, commentsRes] = await Promise.all([
        fetch(`/api/articles/${article.id}/likes`),
        fetch(`/api/articles/${article.id}/comments`)
      ]);

      if (likesRes.ok) {
        const likesData = await likesRes.json();
        setLikeCount(likesData.likeCount || 0);
        if (session?.user?.playerId) {
          setIsLiked(likesData.likes?.some((like: any) => like.player_id === session.user.playerId) || false);
        }
      }

      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        const comments = commentsData.comments || [];
        setCommentCount(comments.length);
        // Get top 2 comments
        setTopComments(comments.slice(0, 2));
      }
    } catch (error) {
      console.error('Error fetching article data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    
    if (!session?.user?.playerId) {
      alert('Please log in to like articles');
      return;
    }

    try {
      if (isLiked) {
        const res = await fetch(`/api/articles/${article.id}/likes`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
        }
      } else {
        const res = await fetch(`/api/articles/${article.id}/likes`, {
          method: 'POST',
        });
        if (res.ok) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-eba-blue dark:hover:border-eba-blue transition-all shadow-sm hover:shadow-md">
      <Link href={`/news/${article.id}`}>
        {article.image && (
          <div className="w-full h-48 relative overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </Link>
      
      <div className="p-6">
        <Link href={`/news/${article.id}`}>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white hover:text-eba-blue transition-colors">
            {article.title}
          </h2>
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(article.publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
        </div>

        <Link href={`/news/${article.id}`}>
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
            {article.excerpt || article.content.slice(0, 150)}...
          </p>
        </Link>
        
        {/* Like and Comment Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLike}
            disabled={status === 'loading'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
          </div>
        </div>

        {/* Top Comments Preview */}
        {topComments.length > 0 && (
          <div className="space-y-3">
            {topComments.map((comment) => (
              <Link 
                key={comment.id}
                href={`/news/${article.id}`}
                className="flex gap-2 text-sm"
              >
                {comment.players?.profile_picture && (
                  <img
                    src={comment.players.profile_picture}
                    alt={comment.players.display_name}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-semibold">{comment.players?.display_name}</span>
                    {' '}
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-2">{comment.content}</span>
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
            {commentCount > 2 && (
              <Link 
                href={`/news/${article.id}`}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-eba-blue transition-colors block"
              >
                View all {commentCount} comments
              </Link>
            )}
          </div>
        )}

        {commentCount === 0 && (
          <Link 
            href={`/news/${article.id}`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-eba-blue transition-colors block"
          >
            Be the first to comment
          </Link>
        )}
      </div>
    </div>
  );
}
