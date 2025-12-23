import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Input from './Input';
import Button from './Button';
import TypingHeading from './TypingHeading';


const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const apiError = axiosError.response?.data as any;
      if (apiError?.errors) {
        const fieldErrors: { [key: string]: string } = {};
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: apiError?.message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <span className="block w-full bg-[#F9FAFB] text-[#142F32] px-4 py-2 rounded-md font-semibold text-center shadow-sm">
        <TypingHeading text="<Login />" />
      </span>
        <p className="mt-2 text-center text-sm text-[#777C90]">
          Or{' '}
          <Link to="/register" className="font-medium text-[#142F32] hover:text-[#E3FFCC] transition-colors duration-200">
            create a new account
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            name="email"
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            name="password"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-[#142F32] hover:text-[#E3FFCC] transition-colors duration-200">
              Forgot your password?
            </Link>
          </div>
        </div>
        <Button type="submit" loading={loading}>
          Sign In
        </Button>
      </form>
            {errors.general && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}
    </AuthLayout>
  );
};

export default Login;