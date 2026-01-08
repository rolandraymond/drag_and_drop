import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../api/auth';
import AuthLayout from './AuthLayout';
import TypingHeading from './TypingHeading';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let redirectTimer: number | null = null;

    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification token.');
        setLoading(false);
        return;
      }

      try {
        await AuthService.verifyEmail(token);
        setSuccess(true);

        redirectTimer = window.setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch {
        setError('Email verification failed. The link may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [token, navigate]);

  return (
    <AuthLayout>
      <div>
        <span className='block w-full bg-[#F9FAFB] text-[#142F32] px-4 py-2 rounded-md font-semibold text-center shadow-sm'>
          <TypingHeading text='<Email Verification />' />
        </span>

        <p className='mt-2 text-center text-sm text-[#777C90]'>
          {loading
            ? 'Verifying your email address...'
            : success
            ? 'Email verified successfully'
            : 'Verification failed'}
        </p>
      </div>

      {loading && (
        <div className='mt-8 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#142F32] mx-auto'></div>
          <p className='mt-2 text-sm text-[#777C90]'>Please wait...</p>
        </div>
      )}

      {!loading && success && (
        <div className='mt-8 bg-green-50 border border-green-200 rounded-lg p-4'>
          <p className='text-sm text-green-800'>
            Email verified successfully! Redirecting to login...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className='mt-8 bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-sm text-red-800'>{error}</p>
        </div>
      )}
    </AuthLayout>
  );
};

export default EmailVerification;
