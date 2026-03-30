'use client';

import s from './LoginForm.module.scss';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {Button, EyeOffOutline, EyeOutline, TextField} from "@jstrommash/ui-kit-lumio";


export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = () => {};

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
          {...register('email')}
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
          {...register('password')}
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
          >
            <span className={s['title-button']}>
              Sign In
            </span>
          </Button>
        </div>

      </div>
    </form>
  );
};
