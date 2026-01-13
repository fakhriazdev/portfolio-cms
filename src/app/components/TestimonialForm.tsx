import React, { useState, useEffect } from 'react';
import { Upload, Star } from 'lucide-react';

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

interface TestimonialFormProps {
    initialData?: Testimonial | null;
    onSave: (data: Partial<Testimonial>) => void;
    onCancel: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        avatar: '',
        featured: false,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (field: keyof Testimonial, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // In a real app, you would upload this to your backend
            const reader = new FileReader();
            reader.onload = (e) => {
                handleInputChange('avatar', e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderStarInput = () => {
        return (
            <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleInputChange('rating', i + 1)}
                        className="focus:outline-none"
                    >
                        <Star
                            className={`w-6 h-6 ${
                                i < (formData.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                        type="text"
                        required
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                        {formData.avatar ? (
                            <img
                                src={formData.avatar}
                                alt="Avatar preview"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4 mr-2" />
                            {formData.avatar ? 'Change Avatar' : 'Upload Avatar'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                {renderStarInput()}
                <p className="text-sm text-gray-500 mt-1">Click to set rating ({formData.rating || 0}/5)</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Content</label>
                <textarea
                    rows={4}
                    required
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write the testimonial content..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Featured Testimonial</span>
                </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    {initialData ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
            </div>
        </form>
    );
};

export default TestimonialForm;