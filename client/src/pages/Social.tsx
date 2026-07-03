import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Social() {
  const [posts, setPosts] = useState([
    { id: 1, author: "User 1", content: "Just mined 0.5 BTC!", likes: 42 },
    { id: 2, author: "User 2", content: "New NFT collection dropped!", likes: 128 },
    { id: 3, author: "User 3", content: "Staking rewards looking good", likes: 89 },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Social Feed</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input placeholder="Search posts..." className="pl-10" />
          </div>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900 rounded-lg p-6 hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-600" />
                <div>
                  <p className="font-semibold text-white">{post.author}</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">{post.content}</p>
              <div className="flex gap-4 text-slate-500">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="w-4 h-4" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" /> Reply
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
