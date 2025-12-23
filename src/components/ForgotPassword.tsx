import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import AuthService from '../api/auth';
import AuthLayout from './AuthLayout';
import Input from './Input';
import Button from './Button';
import TypingHeading from './TypingHeading';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!email) {
      return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Email is invalid';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await AuthService.forgotPassword({ email });
      setSuccess(true);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const apiError = axiosError.response?.data as any;
      setError(apiError?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <span className="block w-full bg-[#F9FAFB] text-[#142F32] px-4 py-2 rounded-md font-semibold text-center shadow-sm">
        <TypingHeading text="auth.forgotPassword()" />
      </span>
        <p className="mt-2 text-center text-sm text-[#777C90]">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      {success ? (
        <div className="mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              If an account with that email exists, we've sent you a password reset link.
            </p>
          </div>
          <div className="mt-6">
            <Link to="/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#142F32] hover:bg-[#E3FFCC] hover:text-[#142F32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E3FFCC]">
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            error={error}
            name="email"
            required
          />
          <Button type="submit" loading={loading}>
            Send Reset Link
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

export default ForgotPassword;