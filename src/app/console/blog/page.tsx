'use client'
import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, Calendar, Tag } from 'lucide-react';
import Modal from '../../components/Modal';
import BlogForm from '../../components/BlogForm';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    publishDate: string;
    tags: string[];
    status: 'draft' | 'published';
}

const BlogManager: React.FC = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
        {
            id: '1',
            title: 'Getting Started with React Hooks',
            excerpt: 'Learn the fundamentals of React Hooks and how they can improve your development workflow.',
            content: 'Full blog content here...',
            image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500',
            author: 'John Doe',
            publishDate: '2024-01-15',
            tags: ['React', 'JavaScript', 'Web Development'],
            status: 'published'
        },
        {
            id: '2',
            title: 'Advanced TypeScript Patterns',
            excerpt: 'Explore advanced TypeScript patterns that will make your code more robust and maintainable.',
            content: 'Full blog content here...',
            image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=500',
            author: 'John Doe',
            publishDate: '2024-01-20',
            tags: ['TypeScript', 'Programming', 'Best Practices'],
            status: 'draft'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSave = (postData: Partial<BlogPost>) => {
        if (editingPost) {
            setBlogPosts(posts => posts.map(post =>
                post.id === editingPost.id ? { ...post, ...postData } : post
            ));
        } else {
            const newPost: BlogPost = {
                id: Date.now().toString(),
                title: '',
                excerpt: '',
                content: '',
                image: '',
                author: 'John Doe',
                publishDate: new Date().toISOString().split('T')[0],
                tags: [],
                status: 'draft',
                ...postData
            } as BlogPost;
            setBlogPosts(posts => [...posts, newPost]);
        }
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setBlogPosts(posts => posts.filter(post => post.id !== id));
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                    <p className="text-gray-600 mt-2">Manage your blog posts and articles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Post</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search posts by title or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Blog Posts List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Blog Posts ({filteredPosts.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex space-x-4">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h3>
                                            <p className="text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                                            <div className="flex items-center space-x-4 mt-3">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(post.publishDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Tag className="w-4 h-4 mr-1" />
                                                    {post.tags.length} tags
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        post.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                          {post.status}
                        </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                                                    >
                            {tag}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPost(null);
                }}
                title={editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                size="large"
            >
                <BlogForm
                    initialData={editingPost}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingPost(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default BlogManager;