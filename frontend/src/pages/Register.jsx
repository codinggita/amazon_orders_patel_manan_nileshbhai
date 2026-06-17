import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiArrowRight, FiShoppingBag, FiCheck } from 'react-icons/fi';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Too short').required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(registerUser(values));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    },
  });

  const perks = [
    'Full order lifecycle management',
    'Real-time analytics & reports',
    'Role-based access control',
    'Advanced search & filtering',
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#080B14' }}>
      <Helmet>
        <title>Create Account | Amazon Orders Dashboard</title>
      </Helmet>

      {/* Left — Form Panel */}
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
            <h2 className="text-2xl font-bold text-white mb-1.5">Create your account</h2>
            <p className="text-sm" style={{ color: '#64748B' }}>Start managing orders in minutes</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl text-sm flex items-center gap-2.5"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#FCA5A5', animation: 'fadeIn 0.3s ease-out' }}>
              <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 text-xs">!</span>
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: '#475569' }} />
                <input
                  id="name" type="text" placeholder="Manan Patel"
                  {...formik.getFieldProps('name')}
                  className="input-field pl-10"
                  style={formik.touched.name && formik.errors.name ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs mt-1.5 ml-0.5" style={{ color: '#F87171' }}>{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: '#475569' }} />
                <input
                  id="email" type="email" placeholder="you@example.com"
                  {...formik.getFieldProps('email')}
                  className="input-field pl-10"
                  style={formik.touched.email && formik.errors.email ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs mt-1.5 ml-0.5" style={{ color: '#F87171' }}>{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={{ color: '#475569' }} />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                  {...formik.getFieldProps('password')}
                  className="input-field pl-10 pr-12"
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: '#818CF8' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Brand Panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f1629 0%, #0a0e1e 60%, #080B14 100%)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full animate-glow"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full animate-glow delay-150"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
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

          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-10">
              <h1 className="text-5xl font-bold leading-tight mb-4" style={{ color: '#F1F5F9' }}>
                Join the<br />
                <span style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  OrderFlow platform.
                </span>
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#64748B' }}>
                Get full control over your Amazon order pipeline with<br />
                powerful tools designed for modern sellers.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <FiCheck size={11} style={{ color: '#818CF8' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial card */}
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#94A3B8' }}>
              "OrderFlow cut our order processing time in half. The dashboard is intuitive and the analytics are genuinely useful."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff' }}>
                R
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Rahul Sharma</p>
                <p className="text-xs" style={{ color: '#475569' }}>Amazon Seller, Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
