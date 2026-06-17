import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

const Login = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  return (
    <div className="min-h-screen flex" style={{ background: '#080B14' }}>
      <Helmet>
        <title>Sign In | Amazon Orders Dashboard</title>
      </Helmet>

      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        {/* Gradient bg */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f1629 0%, #0a0e1e 60%, #080B14 100%)' }} />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full animate-glow"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/5 w-64 h-64 rounded-full animate-glow delay-300"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 flex flex-col h-full px-16 py-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
              <FiShoppingBag className="text-white" size={18} />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">OrderFlow</span>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 text-indigo-300"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Amazon Orders Management
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-4" style={{ color: '#F1F5F9' }}>
                Manage orders<br />
                <span style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  at full speed.
                </span>
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#64748B' }}>
                A unified dashboard to track, analyze and manage<br />
                your Amazon e-commerce operations in real-time.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {['Real-time Analytics', 'CRUD Operations', 'Role-based Access', 'Advanced Filters'].map((f) => (
                <span key={f} className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Orders', value: '50K+' },
              { label: 'Categories', value: '24' },
              { label: 'Uptime', value: '99.9%' },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="w-full lg:w-[48%] flex items-center justify-center px-6 py-12"
        style={{ background: '#080B14' }}>
        <div className="w-full max-w-[400px]" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
              <FiShoppingBag className="text-white" size={16} />
            </div>
            <span className="text-white font-bold text-base">OrderFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>
            <p className="text-sm" style={{ color: '#64748B' }}>Sign in to your dashboard account</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl text-sm flex items-center gap-2.5"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#FCA5A5', animation: 'fadeIn 0.3s ease-out' }}>
              <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 text-xs">!</span>
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: '#475569' }} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...formik.getFieldProps('email')}
                  className="input-field pl-10"
                  style={formik.touched.email && formik.errors.email ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs mt-1.5 ml-0.5" style={{ color: '#F87171' }}>{formik.errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium transition-colors"
                  style={{ color: '#6366F1' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: '#475569' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...formik.getFieldProps('password')}
                  className="input-field pl-10 pr-10"
                  style={formik.touched.password && formik.errors.password ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium transition-colors"
                  style={{ color: '#475569' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs mt-1.5 ml-0.5" style={{ color: '#F87171' }}>{formik.errors.password}</p>
              )}
            </div>

            <div className="pt-2">
              <button type="submit" disabled={status === 'loading'} className="btn-primary">
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#475569' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors" style={{ color: '#818CF8' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
