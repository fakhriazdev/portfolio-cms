'use client'
import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Star, User } from 'lucide-react';
import Modal from '../../components/Modal';
import TestimonialForm from '../../components/TestimonialForm';

interface Testimonial {
    id: string;
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    avatar: string;
    featured: boolean;
    date: string;
}

export default function Page(){
    const [testimonials, setTestimonials] = useState<Testimonial[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            position: 'Product Manager',
            company: 'TechCorp Inc.',
            content: 'John delivered exceptional work on our e-commerce platform. His attention to detail and technical expertise made the project a huge success.',
            rating: 5,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
            featured: true,
            date: '2024-01-15'
        },
        {
            id: '2',
            name: 'Mike Chen',
            position: 'CTO',
            company: 'StartupXYZ',
            content: 'Working with John was a fantastic experience-types.ts. He understood our requirements perfectly and delivered a solution that exceeded our expectations.',
            rating: 5,
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
            featured: false,
            date: '2023-12-20'
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            position: 'Design Director',
            company: 'Creative Agency',
            content: 'John\'s frontend development skills are top-notch. He brought our designs to life with pixel-perfect precision and smooth animations.',
            rating: 4,
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
            featured: true,
            date: '2023-11-10'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = (testimonialData: Partial<Testimonial>) => {
        if (editingTestimonial) {
            setTestimonials(testimonials => testimonials.map(testimonial =>
                testimonial.id === editingTestimonial.id ? { ...testimonial, ...testimonialData } : testimonial
            ));
        } else {
            const newTestimonial: Testimonial = {
                id: Date.now().toString(),
                name: '',
                position: '',
                company: '',
                content: '',
                rating: 5,
                avatar: '',
                featured: false,
                date: new Date().toISOString().split('T')[0],
                ...testimonialData
            } as Testimonial;
            setTestimonials(testimonials => [...testimonials, newTestimonial]);
        }
        setIsModalOpen(false);
        setEditingTestimonial(null);
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setTestimonials(testimonials => testimonials.filter(testimonial => testimonial.id !== id));
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Testimonial Management</h1>
                    <p className="text-gray-600 mt-1">Manage client testimonials and reviews.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Testimonial</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search testimonials by name, company, or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {filteredTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                                    <p className="text-sm text-gray-600">{testimonial.position} at {testimonial.company}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {testimonial.featured && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Featured
                  </span>
                                )}
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => handleEdit(testimonial)}
                                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1 mb-3">
                            {renderStars(testimonial.rating)}
                        </div>

                        <blockquote className="text-gray-600 italic mb-4 leading-relaxed">
                            "{testimonial.content}"
                        </blockquote>

                        <div className="text-sm text-gray-500">
                            {new Date(testimonial.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {filteredTestimonials.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Add your first testimonial to get started.'}
                    </p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTestimonial(null);
                }}
                title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            >
                <TestimonialForm
                    initialData={editingTestimonial}
                    onSave={handleSave}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingTestimonial(null);
                    }}
                />
            </Modal>
        </div>
    );
};
