import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(registerUser(values));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden px-4 py-12">
      <Helmet>
        <title>Register | Amazon Admin</title>
      </Helmet>

      {/* Decorative background elements */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-premium-accent/10 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="glassmorphism-dark rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-premium-textMuted mt-2 text-sm">Join the platform to manage orders</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                {...formik.getFieldProps('name')}
                className={`w-full bg-premium-darker/50 border ${formik.touched.name && formik.errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent/50 transition-all`}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="text-red-400 text-xs mt-1 ml-1">{formik.errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...formik.getFieldProps('email')}
                className={`w-full bg-premium-darker/50 border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent/50 transition-all`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-400 text-xs mt-1 ml-1">{formik.errors.email}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
                className={`w-full bg-premium-darker/50 border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent/50 transition-all`}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-400 text-xs mt-1 ml-1">{formik.errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-premium-accent hover:bg-premium-accentHover text-white font-medium py-3 px-4 rounded-lg shadow-lg shadow-premium-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-premium-dark focus:ring-premium-accent transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-white hover:text-premium-accent transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
