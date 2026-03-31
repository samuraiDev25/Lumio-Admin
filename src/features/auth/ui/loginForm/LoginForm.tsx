'use client';

import s from './LoginForm.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { Button, EyeOffOutline, EyeOutline, TextField } from '@jstrommash/ui-kit-lumio';
import { LOGIN_MUTATION } from '@/features/auth/api/loginMutation';
import { saveAccessToken, readAccessToken } from '@/shared/lib/auth';

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginMutationData = {
  login: {
    accessToken: string;
  };
};

type LoginMutationVariables = LoginFormValues;

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMutation, { loading }] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (readAccessToken()) {
      router.replace('/users');
    }
  }, [router]);

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors('root');

    try {
      const { data } = await loginMutation({
        variables: values,
      });

      const accessToken = data?.login.accessToken;

      if (!accessToken) {
        setError('root', {
          type: 'server',
          message: 'Login failed. Access token was not returned.',
        });

        return;
      }

      saveAccessToken(accessToken);
      router.replace('/users');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';

      setError('root', {
        type: 'server',
        message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s['login-form']}>
      <h1 className={s.title}>Sign In</h1>

      <div className={s['form-wrapper']}>
        <TextField
          type="email"
          label="Email"
          placeholder="Epam@epam.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address.',
            },
          })}
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="**********"
          iconEnd={
            <span className={s['custom-icon-end']}>
              {showPassword ? <EyeOutline /> : <EyeOffOutline />}
            </span>
          }
          onEndIconClick={() => setShowPassword((prev) => !prev)}
          errorMessage={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
          })}
        />
      </div>

      {errors.root && (
        <div className={s['server-error']}>{errors.root.message}</div>
      )}

      <div className={s['auth-actions-block']}>

        <div className={s['submit-wrapper']}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            disabled={loading}
          >
            <span className={s['title-button']}>
              {loading ? 'Signing In...' : 'Sign In'}
            </span>
          </Button>
        </div>

      </div>
    </form>
  );
};
