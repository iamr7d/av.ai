import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import defaultAvatar from '../assets/default-profile.jpg';
import '../styles/Profile.css';

const trendingHashtags = [
  '#AI', '#PhDLife', '#Opportunities', '#Quantum', '#BioMed', '#Scholarships', '#Research', '#ClimateChange', '#ML', '#AcademicTwitter'
];

const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Dr. Priya Sharma',
      avatar: defaultAvatar,
      title: 'Assistant Professor, AI Lab',
    },
    time: '2h ago',
    content: 'Excited to announce a new PhD position in AI for climate change at University of Cambridge! DM for details or apply via our portal. #AI #ClimateChange',
    image: null,
    likes: 12,
    comments: [
      { user: 'Rahul Raj', text: 'Congrats! This is awesome.' },
      { user: 'Dr. Emily Chen', text: 'Shared with my students!' }
    ],
    shares: 1,
    saved: false,
    reaction: '',
  },
  {
    id: 2,
    user: {
      name: 'Rahul Raj',
      avatar: defaultAvatar,
      title: 'PhD Candidate, Quantum Computing',
    },
    time: '5h ago',
    content: 'What are the best conferences for quantum cryptography in 2025? Any suggestions appreciated! #Quantum',
    image: null,
    likes: 7,
    comments: [],
    shares: 0,
    saved: false,
    reaction: '',
  },
  {
    id: 3,
    user: {
      name: 'Dr. Emily Chen',
      avatar: defaultAvatar,
      title: 'Bioengineering Faculty',
    },
    time: '1d ago',
    content: 'We just published a new paper on tissue engineering! Proud of my team. #BioMed #Research',
    image: null,
    likes: 18,
    comments: [],
    shares: 2,
    saved: false,
    reaction: '',
  },
];

const reactionTypes = [
  { type: 'like', label: 'Like', color: 'text-blue-400', icon: '👍' },
  { type: 'love', label: 'Love', color: 'text-pink-400', icon: '❤️' },
  { type: 'insightful', label: 'Insightful', color: 'text-green-400', icon: '💡' },
  { type: 'celebrate', label: 'Celebrate', color: 'text-yellow-400', icon: '🎉' },
];

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(mockPosts);
  const [composerText, setComposerText] = useState('');
  const [composerImage, setComposerImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    // Fetch feed data when component mounts
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        // This is a placeholder - replace with your actual API call to fetch feed data
        // const response = await fetch('/api/feed');
        // const data = await response.json();
        // setOpportunities(data);
        
        // For now, using mock data
        setTimeout(() => {
          setOpportunities([
            {
              id: 1,
              title: "PhD Position in AI for Climate Change",
              university: "University of Cambridge",
              department: "Computer Science",
              deadline: "2025-08-15",
              description: "Join our research team working on AI solutions for climate change monitoring and mitigation.",
              tags: ["AI", "Climate Change", "Machine Learning"]
            },
            {
              id: 2,
              title: "Doctoral Research in Quantum Computing",
              university: "MIT",
              department: "Physics",
              deadline: "2025-07-30",
              description: "Research position focused on quantum algorithms and their applications in cryptography.",
              tags: ["Quantum Computing", "Cryptography", "Physics"]
            },
            {
              id: 3,
              title: "PhD Scholarship in Biomedical Engineering",
              university: "Stanford University",
              department: "Bioengineering",
              deadline: "2025-09-01",
              description: "Work on cutting-edge medical devices and tissue engineering applications.",
              tags: ["Biomedical", "Engineering", "Healthcare"]
            }
          ]);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error("Error fetching feed data:", err);
        setError("Failed to load feed. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  const handlePost = (e) => {
    e.preventDefault();
    if (!composerText.trim() && !composerImage) return;
    setPosting(true);
    setTimeout(() => {
      setPosts([
        {
          id: Date.now(),
          user: {
            name: user?.user_metadata?.full_name || user?.email || 'You',
            avatar: user?.user_metadata?.avatar_url || defaultAvatar,
            title: 'PhD Enthusiast',
          },
          time: 'Just now',
          content: composerText,
          image: composerImage,
          likes: 0,
          comments: [],
          shares: 0,
          saved: false,
          reaction: '',
        },
        ...posts,
      ]);
      setComposerText('');
      setComposerImage(null);
      setPosting(false);
    }, 800);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setComposerImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReaction = (postId, reactionType) => {
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, reaction: reactionType, likes: post.reaction === reactionType ? post.likes : post.likes + 1 } : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

  const handleToggleComments = (postId) => {
    setExpandedComments(expanded => ({ ...expanded, [postId]: !expanded[postId] }));
  };

  const handleAddComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, { user: user?.user_metadata?.full_name || 'You', text }] } : post
    ));
  };

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-10 px-2 sm:px-0 bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Feed Main */}
        <div className="flex-1">
          {/* Post Composer */}
          <div className="bg-black/60 border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl flex flex-col gap-3 glassmorphic">
            <div className="flex items-center gap-3 mb-2">
              <img src={user?.user_metadata?.avatar_url || defaultAvatar} alt="avatar" className="w-12 h-12 rounded-full border border-white/10" />
              <div>
                <div className="font-semibold text-white text-lg">{user?.user_metadata?.full_name || user?.email || 'You'}</div>
                <div className="text-xs text-gray-400">Share an update, opportunity, or question</div>
              </div>
            </div>
            <form onSubmit={handlePost}>
              <textarea
                className="w-full bg-gray-800/60 text-white rounded-lg p-3 border border-white/10 focus:ring-2 focus:ring-primary focus:outline-none resize-none min-h-[60px]"
                placeholder="What's on your mind? Use #hashtags to reach more people!"
                value={composerText}
                onChange={e => setComposerText(e.target.value)}
                maxLength={500}
                disabled={posting}
              />
              {composerImage && (
                <div className="relative mt-2">
                  <img src={composerImage} alt="upload preview" className="rounded-lg max-h-60 w-full object-cover border border-white/10" />
                  <button type="button" className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1" onClick={() => setComposerImage(null)}>
                    ✕
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <button type="button" className="text-blue-400 hover:text-blue-300" onClick={() => fileInputRef.current.click()}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                  disabled={posting || (!composerText.trim() && !composerImage)}
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Feed Posts */}
          <div className="space-y-8">
            {posts.map(post => (
              <div key={post.id} className="bg-black/60 border border-white/10 rounded-2xl p-6 shadow-xl glassmorphic hover:shadow-blue-700/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/10" />
                  <div>
                    <div className="font-semibold text-white">{post.user.name}</div>
                    <div className="text-xs text-gray-400">{post.user.title} • {post.time}</div>
                  </div>
                </div>
                <div className="text-white text-base mb-3 whitespace-pre-line">
                  {post.content.split(/(#[\w]+)/g).map((part, i) =>
                    part.startsWith('#') ? <span key={i} className="text-blue-400 hover:underline cursor-pointer">{part}</span> : part
                  )}
                </div>
                {post.image && (
                  <img src={post.image} alt="post media" className="rounded-lg mb-3 max-h-80 w-full object-cover border border-white/10" />
                )}
                <div className="flex gap-6 mt-2 text-gray-400 items-center">
                  {/* Reactions */}
                  <div className="flex gap-1">
                    {reactionTypes.map(r => (
                      <button
                        key={r.type}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full hover:${r.color} transition text-lg ${post.reaction === r.type ? r.color + ' font-bold scale-110' : ''}`}
                        onClick={() => handleReaction(post.id, r.type)}
                        aria-label={r.label}
                      >
                        {r.icon}
                      </button>
                    ))}
                  </div>
                  <span className="ml-2 text-white/80 text-sm">{post.likes} {post.likes === 1 ? 'reaction' : 'reactions'}</span>
                  {/* Comment button */}
                  <button className="flex items-center gap-1 hover:text-green-400 transition ml-4" onClick={() => handleToggleComments(post.id)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
                    <span>{post.comments.length}</span>
                  </button>
                  {/* Share button */}
                  <button className="flex items-center gap-1 hover:text-purple-400 transition ml-4" onClick={() => navigator.clipboard.writeText(window.location.href + '#feed') }>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v16h16V4z" /></svg>
                    <span>Share</span>
                  </button>
                  {/* Save button */}
                  <button className={`flex items-center gap-1 ml-auto transition ${post.saved ? 'text-yellow-400' : 'hover:text-yellow-400'}`} onClick={() => handleSave(post.id)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 19l7-7 7 7" /></svg>
                    <span>{post.saved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div className="mt-4 bg-gray-900/60 rounded-xl p-4 border border-white/10">
                    <div className="mb-2 text-white font-semibold">Comments</div>
                    <div className="space-y-2 mb-2">
                      {post.comments.length === 0 && <div className="text-gray-400 text-sm">No comments yet.</div>}
                      {post.comments.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-200 text-sm">
                          <span className="font-bold">{c.user}:</span> <span>{c.text}</span>
                        </div>
                      ))}
                    </div>
                    <CommentInput onAdd={text => handleAddComment(post.id, text)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Trending Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-black/60 border border-white/10 rounded-2xl p-6 shadow-xl glassmorphic mb-8">
            <div className="font-bold text-white text-lg mb-3">Trending Hashtags</div>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gradient-to-r from-purple-800/30 to-blue-800/30 text-white/90 rounded-full text-sm backdrop-blur-lg border border-purple-500/10 cursor-pointer hover:bg-blue-700/40 transition">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

// Comment input component
const CommentInput = ({ onAdd }) => {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onAdd(text);
        setText('');
      }}
      className="flex gap-2 mt-2"
    >
      <input
        className="flex-1 bg-gray-800/60 text-white rounded-lg p-2 border border-white/10 focus:ring-2 focus:ring-primary focus:outline-none"
        placeholder="Write a comment..."
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={200}
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50" disabled={!text.trim()}>
        Post
      </button>
    </form>
  );
};

export default Feed;
