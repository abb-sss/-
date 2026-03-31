import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Eye, Clock, MessageSquare } from 'lucide-react';

export default function ResourceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'new';

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (currentCategory) query.set('categoryId', currentCategory);
    if (currentSort) query.set('sort', currentSort);
    
    fetch(`/api/resources?${query.toString()}`)
      .then(res => res.json())
      .then(data => setResources(data.data || []));
  }, [currentCategory, currentSort]);

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 space-y-8">
        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Filter size={18} />
            分类筛选
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setFilter('category', '')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !currentCategory ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              全部资源
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setFilter('category', cat.id.toString())}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentCategory === cat.id.toString() ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main List */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">发现资源</h1>
          <div className="flex bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setFilter('sort', 'new')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                currentSort === 'new' ? 'bg-muted text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              最新发布
            </button>
            <button
              onClick={() => setFilter('sort', 'hot')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                currentSort === 'hot' ? 'bg-muted text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              最多浏览
            </button>
            <button
              onClick={() => setFilter('sort', 'likes')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                currentSort === 'likes' ? 'bg-muted text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              最多点赞
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          {resources.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>未找到相关资源，换个筛选条件试试吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
