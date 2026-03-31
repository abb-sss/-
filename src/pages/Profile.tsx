import { User, Settings, FileText, Bookmark, MessageSquare, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('published');
  
  // Mock data
  const user = {
    username: 'TraeDeveloper',
    email: 'dev@trae.ai',
    joinDate: '2026-03-31',
    stats: {
      published: 12,
      saved: 45,
      likes: 128
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="bg-card border border-border rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-accent/20"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto rounded-full bg-background border-4 border-card flex items-center justify-center mb-4 shadow-xl">
              <User size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-1">{user.username}</h2>
            <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-border/50">
              <div>
                <div className="text-2xl font-bold text-foreground">{user.stats.published}</div>
                <div className="text-xs text-muted-foreground">发布</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{user.stats.saved}</div>
                <div className="text-xs text-muted-foreground">收藏</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{user.stats.likes}</div>
                <div className="text-xs text-muted-foreground">获赞</div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted text-foreground rounded-xl transition-colors text-sm font-medium">
                <Settings size={18} />
                个人设置
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive rounded-xl transition-colors text-sm font-medium">
                <LogOut size={18} />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-card border border-border rounded-3xl overflow-hidden min-h-[600px]">
          <div className="flex border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all ${
                activeTab === 'published' 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <FileText size={18} />
              我的发布
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all ${
                activeTab === 'saved' 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <Bookmark size={18} />
              我的收藏
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all ${
                activeTab === 'comments' 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <MessageSquare size={18} />
              我的评论
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 opacity-50">
                {activeTab === 'published' && <FileText size={32} />}
                {activeTab === 'saved' && <Bookmark size={32} />}
                {activeTab === 'comments' && <MessageSquare size={32} />}
              </div>
              <p>暂无内容</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
