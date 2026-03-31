'use server';

import { signIn } from '@/auth';
import { actionError, actionSuccess } from '@/lib/actionResponse';
import { registerUser } from '@/queries/auth.queries';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect';

export async function handleRegisterUser(prevState, formData) {
  try {
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (password !== confirmPassword) {
      return actionError('Passwords do not match. Please try again.');
    }

    const formRole = formData.get('user-role');

    const input = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      role: formRole === 'instructor' ? 'teacher' : formRole,
      password: formData.get('password'),
      confirmPassword: formData.get('confirm-password'),
    };

    await registerUser(input);
    return actionSuccess(null, 'Account created! Redirecting...');
  } catch (error) {
    console.error('An unexpected error happened in handleRegisterUser action');
    console.error(error);
    return actionError(error);
  }
}

export async function handleLoginUser(prevState, formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return actionSuccess(null, 'Logged in! Redirecting...');
  } catch (error) {
    if (isRedirectError(error)) {
      return actionSuccess(null, 'Logged in! Redirecting...');
    }

    if (error instanceof AuthError) {
      console.error('AuthError caught in login action:', error.type);
      return actionError('Invalid credentials or authentication error.');
    }

    console.error('Unhandled error in handleLoginUser action:', error);
    return actionError(error.message || 'An unexpected error occurred');
  }
}

export async function handleSocialLogin(formData) {
  try {
    const action = formData.get('action');

    await signIn(action, {
      redirectTo: '/courses',
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('Social login error:', error);
    return actionError(error);
  }
}
