import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import AuthService from '../api/auth';
import AuthLayout from './AuthLayout';
import Input from './Input';
import Button from './Button';
import TypingHeading from './TypingHeading';


const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
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
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
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
    if (!token) {
      setErrors({ general: 'Invalid reset token.' });
      return;
    }
    setLoading(true);
    try {
      await AuthService.resetPassword({ token, email, password: formData.password, password_confirmation: formData.password_confirmation });
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
        setErrors({ general: apiError?.message || 'Password reset failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <span className="block w-full bg-[#F9FAFB] text-[#142F32] px-4 py-2 rounded-md font-semibold text-center shadow-sm">
        <TypingHeading text="auth.resetPassword()" />
        </span>
        <p className="mt-2 text-center text-sm text-[#777C90]">
          Enter your new password below.
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
              Your password has been successfully reset.
            </p>
          </div>
          <div className="mt-6">
            <Link to="/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#142F32] hover:bg-[#E3FFCC] hover:text-[#142F32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E3FFCC]">
              Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              name="password"
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={errors.password_confirmation}
              name="password_confirmation"
              required
            />
          </div>
          <Button type="submit" loading={loading}>
            Reset Password
          </Button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-[#142F32] hover:text-[#E3FFCC] transition-colors duration-200">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;