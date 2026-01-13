'use client';
import { startTransition } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginAction } from '@/src/app/actions/auth';

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;
type State = { error?: string } | undefined;

export default function LoginPage() {
    // Server Action state
    const [state, formAction, pending] = useActionState<State, FormData>(
        loginAction as any,
        undefined
    );

    // RHF untuk validasi client-side
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const onSubmit = (data: LoginForm) => {
        const fd = new FormData();
        fd.append('email', data.email.trim());
        fd.append('password', data.password);

        // ⬇️ WAJIB: panggil action di dalam transition
        startTransition(() => {
            formAction(fd); // loginAction akan redirect ke /dashboard bila sukses
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
                <div className="px-6 pt-6 pb-2">
                    <h1 className="text-2xl font-bold text-center tracking-tight text-gray-900">Welcome back</h1>
                    <p className="mt-1 text-center text-sm text-gray-600">Sign in to your account to continue</p>
                </div>

                <div className="px-6 pb-6">
                    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4">
                        {state?.error && (
                            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                                {state.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.email ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                {...register('email')}
                            />
                            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.password ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}`}
                                {...register('password')}
                            />
                            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={pending}
                            aria-busy={pending}
                            className={`relative inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200
              hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                            {pending ? (
                                <>
                                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
