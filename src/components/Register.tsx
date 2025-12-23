import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Input from './Input';
import Button from './Button';
import TypingHeading from './TypingHeading';


const Register: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      setSuccess(true);
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
        setErrors({ general: apiError?.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <span className="block w-full bg-[#F9FAFB] text-[#142F32] px-4 py-2 rounded-md font-semibold text-center shadow-sm">
          <TypingHeading text="<Register />" />
      </span>
        <p className="mt-2 text-center text-sm text-[#777C90]">
          Or{' '}
          <Link to="/login" className="font-medium text-[#142F32] hover:text-[#E3FFCC] transition-colors duration-200">
            sign in to existing account
          </Link>
        </p>
        {errors.general && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}
      </div>
      {success ? (
        <div className="mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Registration successful! Please check your email to verify your account.
            </p>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            type="text"
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            name="name"
            required
          />
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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            name="password"
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            name="confirmPassword"
            required
          />
        </div>
        <Button type="submit" loading={loading}>
          Create Account
        </Button>
      </form>
      )}
    </AuthLayout>
  );
};

export default Register;