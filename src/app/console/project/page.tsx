'use client'
import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, ExternalLink, Gitlab, Eye } from 'lucide-react';
import Modal from '../../components/Modal';
import ProjectForm from '../../components/ProjectForm';

interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    status: 'completed' | 'in-progress' | 'planned';
    startDate: string;
    endDate: string;
}

export default function Page(){
    const [projects, setProjects] = useState<Project[]>([
        {
            id: '1',
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform with user authentication, payment integration, and admin dashboard.',
            image: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=500',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
            liveUrl: 'https://example-ecommerce.com',
            githubUrl: 'https://github.com/johndoe/ecommerce',
            featured: true,
            status: 'completed',
            startDate: '2023-06',
            endDate: '2023-12'
        },
        {
            id: '2',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates and team collaboration features.',
            image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=500',
            technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
            liveUrl: 'https://taskapp.example.com',
            githubUrl: 'https://github.com/johndoe/taskapp',
            featured: false,
            status: 'in-progress',
            startDate: '2024-01',
            endDate: ''
        },
        {
            id: '3',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates and team collaboration features.',
            image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=500',
            technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
            liveUrl: 'https://taskapp.example.com',
            githubUrl: 'https://github.com/johndoe/taskapp',
            featured: false,
            status: 'in-progress',
            startDate: '2024-01',
            endDate: ''
        },{
            id: '4',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates and team collaboration features.',
            image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=500',
            technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
            liveUrl: 'https://taskapp.example.com',
            githubUrl: 'https://github.com/johndoe/taskapp',
            featured: false,
            status: 'in-progress',
            startDate: '2024-01',
            endDate: ''
        },{
            id: '5',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates and team collaboration features.',
            image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=500',
            technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
            liveUrl: 'https://taskapp.example.com',
            githubUrl: 'https://github.com/johndoe/taskapp',
            featured: false,
            status: 'in-progress',
            startDate: '2024-01',
            endDate: ''
        }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleSave = (projectData: Partial<Project>) => {
        if (editingProject) {
            setProjects(projects => projects.map(project =>
                project.id === editingProject.id ? { ...project, ...projectData } : project
            ));
        } else {
            const newProject: Project = {
                id: Date.now().toString(),
                title: '',
                description: '',
                image: '',
                technologies: [],
                liveUrl: '',
                githubUrl: '',
                featured: false,
                status: 'planned',
                startDate: new Date().toISOString().split('T')[0].slice(0, 7),
                endDate: '',
                ...projectData
            } as Project;
            setProjects(projects => [...projects, newProject]);
        }
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setProjects(projects => projects.filter(project => project.id !== id));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'planned':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-2">
        <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
    <p className="text-gray-600 mt-1">Manage your portfolio projects and showcase your work.</p>
    </div>
    <button
    onClick={() => setIsModalOpen(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
    >
    <Plus className="w-5 h-5" />
        <span>New Project</span>
    </button>
    </div>

    {/* Search and Filters */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
    <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
        type="text"
    placeholder="Search projects by title or technology..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
        <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
    <option value="all">All Status</option>
    <option value="completed">Completed</option>
        <option value="in-progress">In Progress</option>
    <option value="planned">Planned</option>
        </select>
        </div>
        </div>

    {/* Projects Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
            <img
                src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover"
            />
            {project.featured && (
                    <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-medium rounded-full">
                        Featured
                        </span>
                        </div>
                )}
            <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
        {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        </div>
        </div>

        <div className="p-3">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
                <span
                    key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
            >
            {tech}
            </span>
))}
    </div>

    <div className="flex items-center justify-between">
    <div className="flex space-x-3">
        {project.liveUrl && (
                <a
                    href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Live"
            >
            <ExternalLink className="w-5 h-5" />
                </a>
)}
    {project.githubUrl && (
        <a
            href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        title="View GitHub"
        >
        <Gitlab className="w-5 h-5" />
            </a>
    )}
    </div>
    <div className="flex items-center space-x-2">
    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
    <Eye className="w-5 h-5" />
        </button>
        <button
    onClick={() => handleEdit(project)}
    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
    >
    <Edit3 className="w-5 h-5" />
        </button>
        <button
    onClick={() => handleDelete(project.id)}
    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
    <Trash2 className="w-5 h-5" />
        </button>
        </div>
        </div>
        </div>
        </div>
))}
    </div>

    <Modal
    isOpen={isModalOpen}
    onClose={() => {
        setIsModalOpen(false);
        setEditingProject(null);
    }}
    title={editingProject ? 'Edit Project' : 'Create New Project'}
    size="large"
    >
    <ProjectForm
        initialData={editingProject}
    onSave={handleSave}
    onCancel={() => {
        setIsModalOpen(false);
        setEditingProject(null);
    }}
    />
    </Modal>
    </div>
);
};
