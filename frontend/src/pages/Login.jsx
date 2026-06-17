import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden px-4">
      <Helmet>
        <title>Login | Amazon Admin</title>
      </Helmet>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-premium-accent/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-900/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="glassmorphism-dark rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-premium-accent/20 text-premium-accent mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-premium-textMuted mt-2 text-sm">Sign in to your dashboard account</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...formik.getFieldProps('email')}
                className={`w-full bg-premium-darker/50 border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent/50 transition-all`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{formik.errors.email}</p>
              ) : null}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-premium-accent hover:text-premium-accentHover transition-colors">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
                className={`w-full bg-premium-darker/50 border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent/50 transition-all`}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-400 text-xs mt-1.5 ml-1">{formik.errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-premium-accent hover:bg-premium-accentHover text-white font-medium py-3 px-4 rounded-lg shadow-lg shadow-premium-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-premium-dark focus:ring-premium-accent transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-white hover:text-premium-accent transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
