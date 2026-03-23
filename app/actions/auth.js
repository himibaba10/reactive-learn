'use server';

import { signIn } from '@/auth';
import { registerUser } from '@/queries/auth.queries';

export async function handleRegisterUser(prevState, formData) {
  try {
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match. Please try again.' };
    }

    const input = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      role: formData.get('user-role'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirm-password'),
    };

    await registerUser(input);
    return { success: true, message: 'Account created! Redirecting...' };
  } catch (error) {
    console.error('An unexpected error happened in handleRegisterUser action');
    console.error(error);
    return { error: error.message };
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

    return { success: true, message: 'Logged in! Please wait...' };
  } catch (error) {
    console.error('An unexpected error happened in handleLoginUser action');
    console.error(error);
    return { error: error.message };
  }
}

export async function handleSocialLogin(formData) {
  const action = formData.get('action');

  await signIn(action, {
    redirectTo: '/courses',
  });
}
