import React from 'react';
import { BookOpen, Briefcase, FolderOpen, MessageSquare, TrendingUp } from 'lucide-react';

export default function Page(){
    const stats = [
        { name: 'Total Projects', value: '12', icon: FolderOpen, color: 'bg-blue-500', change: '+2' },
        { name: 'Blog Posts', value: '24', icon: BookOpen, color: 'bg-green-500', change: '+5' },
        { name: 'Experiences', value: '8', icon: Briefcase, color: 'bg-purple-500', change: '+1' },
        { name: 'Testimonials', value: '15', icon: MessageSquare, color: 'bg-orange-500', change: '+3' },
    ];

    const recentActivities = [
        { action: 'New blog post created', item: 'React Best Practices', time: '2 hours ago' },
        { action: 'Project updated', item: 'E-commerce Website', time: '4 hours ago' },
        { action: 'Testimonial added', item: 'John Doe Review', time: '1 day ago' },
        { action: 'Experience updated', item: 'Senior Developer Role', time: '2 days ago' },
    ];

    return (
        <div className="space-y-2">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your portfolio.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <p className="text-sm text-green-600 mt-2 flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {stat.change} this month
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-4">
                    <div className="space-y-2">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-600">{activity.item}</p>
                                </div>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
