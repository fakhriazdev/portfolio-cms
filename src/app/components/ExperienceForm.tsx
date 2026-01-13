import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, setIn } from 'formik';
import { z } from 'zod';

type ExperienceInsert = {
    company: string;
    position: string;
    description: string;
    startDate: string; // YYYY-MM
    endDate?: string | null; // '' untuk current
    current?: boolean;
};

interface ExperienceFormProps {
    initialData?: Partial<ExperienceInsert> | null;
    onSave: (data: {
        company: string;
        position: string;
        description: string;
        startDate: string;
        endDate: string; // '' jika current
        current: boolean;
    }) => void;
    onCancel: () => void;
}

const defaultValues: Required<Omit<ExperienceInsert, 'endDate'>> & { endDate: string } = {
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
};

const Month = z.string().regex(/^\d{4}-\d{2}$/, 'Format harus YYYY-MM');
const ExperienceSchema = z
    .object({
        company: z.string().min(1, 'Company wajib diisi.').max(120),
        position: z.string().min(1, 'Position wajib diisi.').max(120),
        description: z.string().max(4000, 'Deskripsi maksimal 4000 karakter.').optional().or(z.literal('')),
        startDate: Month,
        endDate: z.preprocess(
            (v) => (v == null ? '' : v),             // <-- null/undefined => ''
            Month.or(z.literal(''))                  //     '' diperbolehkan
        ),
        current: z.boolean().default(false),
    })
    .refine((d) => d.current || !!d.endDate, {
        message: 'End Date wajib diisi jika tidak sedang bekerja.',
        path: ['endDate'],
    })
    .refine((d) => d.current || !d.endDate || d.endDate >= d.startDate, {
        message: 'End Date tidak boleh lebih awal dari Start Date.',
        path: ['endDate'],
    });

function zodToFormikErrors<T>(error: z.ZodError<T>) {
    let formikErrors: any = {};
    for (const issue of error.issues) {
        const path = issue.path.join('.');
        formikErrors = setIn(formikErrors, path, issue.message);
    }
    return formikErrors;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, onSave, onCancel }) => {
    const init = { ...defaultValues, ...(initialData || {}) };

    const monthNow = useMemo(() => {
        const d = new Date();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        return `${d.getFullYear()}-${m}`;
    }, []);

    const [touchedCurrent, setTouchedCurrent] = useState(false);

    return (
        <Formik
            initialValues={init}
            enableReinitialize
            validate={(values) => {
                const parsed = ExperienceSchema.safeParse({
                    ...values,
                    description: values.description ?? '',
                    endDate: values.current ? '' : (values.endDate ?? ''),
                    current: !!values.current,
                });
                if (parsed.success) return {};
                return zodToFormikErrors(parsed.error);
            }}
            onSubmit={(values) => {
                const payload = {
                    company: (values.company || '').trim(),
                    position: (values.position || '').trim(),
                    description: (values.description || '').trim(),
                    startDate: values.startDate,
                    endDate: values.current ? '' : (values.endDate || ''),
                    current: !!values.current,
                };
                onSave(payload);
            }}
        >
            {({ values, errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                    {/* Position */}
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                            Position <span className="text-red-500">*</span>
                        </label>
                        <Field
                            id="position"
                            name="position"
                            type="text"
                            maxLength={120}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                touched.position && errors.position ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <ErrorMessage name="position" component="p" className="mt-1 text-xs text-red-600" />
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company <span className="text-red-500">*</span>
                        </label>
                        <Field
                            id="company"
                            name="company"
                            type="text"
                            maxLength={120}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                touched.company && errors.company ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <ErrorMessage name="company" component="p" className="mt-1 text-xs text-red-600" />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <Field
                            as="textarea"
                            id="description"
                            name="description"
                            rows={4}
                            maxLength={4000}
                            placeholder="Ringkas tanggung jawab & pencapaian terukur (contoh: ‘Kurangi waktu build 35%’)."
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                touched.description && errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <ErrorMessage name="description" component="p" className="mt-1 text-xs text-red-600" />
                    </div>

                    {/* Dates */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <Field
                                id="startDate"
                                name="startDate"
                                type="month"
                                max={monthNow}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.startDate && errors.startDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            <ErrorMessage name="startDate" component="p" className="mt-1 text-xs text-red-600" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                End Date {!values.current && <span className="text-red-500">*</span>}
                            </label>
                            <Field
                                id="endDate"
                                name="endDate"
                                type="month"
                                min={values.startDate || undefined}
                                max={monthNow}
                                disabled={values.current}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.endDate && errors.endDate ? 'border-red-500' : 'border-gray-300'
                                } ${values.current ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            <ErrorMessage name="endDate" component="p" className="mt-1 text-xs text-red-600" />
                        </div>
                    </div>

                    {/* Current */}
                    <div className="flex items-center">
                        <input
                            id="current"
                            type="checkbox"
                            checked={!!values.current}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFieldValue('current', checked);
                                setTouchedCurrent(true);
                                if (checked) setFieldValue('endDate', '');
                            }}
                            className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="current" className="text-sm text-gray-700">
                            Currently working here
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ExperienceForm;
