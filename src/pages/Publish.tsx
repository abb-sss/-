import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Link as LinkIcon, FileText, Tag, Image as ImageIcon } from 'lucide-react';

export default function Publish() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    categoryId: '',
    description: '',
    tags: '',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        tags: tagsArray,
        authorId: 1, // Mock user
      }),
    });
    const data = await res.json();
    if (data.success) {
      navigate(`/resources/${data.data.id}`);
    } else {
      alert('发布失败');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">发布优质资源</h1>
        <p className="text-muted-foreground">分享你发现的有用工具、教程或开源项目，帮助更多开发者。</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              资源标题 <span className="text-destructive">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="例如：React 18 官方文档中译版"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <LinkIcon size={16} className="text-primary" />
              资源链接 <span className="text-destructive">*</span>
            </label>
            <input
              required
              type="url"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">所属分类 <span className="text-destructive">*</span></label>
            <select
              required
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            >
              <option value="" disabled>请选择分类</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">资源简介 <span className="text-destructive">*</span></label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="简要介绍这个资源的用途、特点等..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag size={16} className="text-primary" />
              标签 (选填)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              placeholder="多个标签请用逗号分隔，例如：前端,React,教程"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              <Send size={20} />
              立即发布
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
