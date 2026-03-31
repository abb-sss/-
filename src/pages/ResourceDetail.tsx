import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, Eye, Share2, MessageSquare, User, Clock, BookmarkPlus } from 'lucide-react';

export default function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/resources/${id}`)
      .then(res => res.json())
      .then(data => {
        setResource(data.data);
        setLoading(false);
      });
  }, [id]);

  const handleLike = () => {
    fetch(`/api/resources/${id}/like`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResource({ ...resource, likeCount: data.data.likeCount });
        }
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resource) {
    return <div className="text-center py-20">资源不存在</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={20} />
        返回列表
      </Link>

      <article className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg mb-8">
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {resource.category?.name || '综合'}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Clock size={14} /> {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
            {resource.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">{resource.author?.username || '匿名用户'}</div>
                <div className="text-xs text-muted-foreground">发布者</div>
              </div>
            </div>
            <div className="h-10 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-1.5"><Eye size={18} /> {resource.viewCount} 浏览</span>
              <span className="flex items-center gap-1.5 text-accent"><Star size={18} /> {resource.likeCount} 点赞</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {resource.description}
            </p>
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {resource.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-background rounded-2xl border border-border/50">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              <ExternalLink size={20} />
              直达资源链接
            </a>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleLike}
                className="flex-1 sm:flex-none px-6 py-4 bg-card border border-border hover:border-accent hover:text-accent rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
              >
                <Star size={20} /> 点赞
              </button>
              <button className="flex-1 sm:flex-none px-6 py-4 bg-card border border-border hover:bg-muted rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-muted-foreground">
                <BookmarkPlus size={20} /> 收藏
              </button>
              <button className="px-4 py-4 bg-card border border-border hover:bg-muted rounded-xl flex items-center justify-center transition-all text-muted-foreground">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-card border border-border rounded-3xl p-8 md:p-12">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          评论 ({resource.comments?.length || 0})
        </h3>
        
        <div className="flex gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User size={20} className="text-muted-foreground" />
          </div>
          <div className="flex-1">
            <textarea
              rows={3}
              placeholder="写下你的想法..."
              className="w-full bg-background border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
            ></textarea>
            <div className="flex justify-end mt-3">
              <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                发表评论
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {resource.comments?.map((comment: any) => (
            <div key={comment.id} className="flex gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.user?.username || '匿名用户'}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
          {(!resource.comments || resource.comments.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              暂无评论，来做第一个发言的人吧！
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
