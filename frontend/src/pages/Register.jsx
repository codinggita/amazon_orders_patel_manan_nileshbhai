import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(registerUser(values));
      if (!result.error) {
        navigate('/login');
      }
    },
  });

  return (
    <div>
      <h3 className="text-xl font-medium text-gray-900 text-center mb-6">Create a new account</h3>
      {error && <div className="mb-4 text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</div>}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
          >
            {status === 'loading' ? 'Creating...' : 'Register'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</Link>
      </div>
    </div>
  );
};

export default Register;
