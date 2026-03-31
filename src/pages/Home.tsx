import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Star, Clock, Eye, MessageSquare, ChevronRight } from 'lucide-react';

export default function Home() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []));

    // Fetch popular resources
    fetch('/api/resources?sort=hot')
      .then(res => res.json())
      .then(data => setResources((data.data || []).slice(0, 6)));
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap size={16} className="text-accent" />
            <span>发现最新的开发者资源与工具</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
            探索与分享 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">顶级 IT 资源</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            汇聚云服务优惠、开发工具、开源项目与技术教程。加入我们的开发者社区，让每一次开发都更加高效。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/resources"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 group"
            >
              浏览资源
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/publish"
              className="w-full sm:w-auto px-8 py-4 bg-card hover:bg-muted border border-border text-foreground rounded-full font-medium transition-all flex items-center justify-center gap-2"
            >
              分享你的发现
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            热门分类
          </h2>
          <Link to="/resources" className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors">
            全部分类 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              to={`/resources?category=${cat.id}`}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Resources */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-accent rounded-full"></span>
            热门推荐
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: any) => (
            <Link
              key={resource.id}
              to={`/resources/${resource.id}`}
              className="group flex flex-col bg-card rounded-2xl border border-border hover:border-primary/30 overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg text-primary border border-border">
                      {resource.title.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                        {resource.category?.name || '综合'}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                  {resource.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Eye size={14} /> {resource.viewCount}</span>
                  <span className="flex items-center gap-1 text-accent"><Star size={14} /> {resource.likeCount}</span>
                </div>
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
