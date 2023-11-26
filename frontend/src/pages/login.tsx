import configuredAxios from '@/config/axios';
import Toaster from '@/utils/toaster';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Cookies from 'js-cookie';
import { Eye, EyeClosed, ArrowRight } from '@phosphor-icons/react';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mutex, setMutex] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();

    if (mutex) return;
    setMutex(true);

    const formData = { username, password };

    const toaster = Toaster.startLoad('Logging In...');

    await configuredAxios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, formData, {
        withCredentials: true,
      })
      .then(res => {
        if (res.status === 200) {
          Toaster.stopLoad(toaster, 'Logged In!', 1);
          const user = res.data.user;
          Cookies.set('token', res.data.token, {
            expires: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_TIME),
          });
          Cookies.set('id', user.id, {
            expires: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_TIME),
          });

          router.replace('/');
        } else if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
        else Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        setMutex(false);
      })
      .catch(err => {
        if (err.response?.data?.message) Toaster.stopLoad(toaster, err.response.data.message, 0);
        else Toaster.stopLoad(toaster, 'Internal Server Error', 0);

        setMutex(false);
      });
  };

  return (
    <div className="w-1/3 mx-auto flex flex-col gap-12 pt-48">
      <div className="font-primary text-7xl font-medium text-center text-primary">Get Back In</div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="font-medium">Username</div>
            <input
              name="username"
              value={username}
              onChange={el => setUsername(el.target.value)}
              type="text"
              className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="font-medium">Password</div>

            <div className="w-full relative">
              <input
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={el => setPassword(el.target.value)}
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-white p-2 rounded-xl focus:outline-none focus:bg-white border-2 text-gray-400 pr-10"
              />
              {showPassword ? (
                <Eye
                  onClick={() => setShowPassword(false)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  size={20}
                  weight="regular"
                />
              ) : (
                <EyeClosed
                  onClick={() => setShowPassword(true)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  size={20}
                  weight="regular"
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full p-1 flex flex-col gap-6 items-center">
          <button
            type="submit"
            className="w-full relative p-2 border-2 after:absolute after:-top-[3px] after:-left-[3px] after:-right-[3px] after:-bottom-[3.5px] after:-z-10 after:rounded-xl flex items-center cursor-pointer justify-center gap-2 bg-[#393939] hover:bg-[#1d1d1d] active:bg-secondary border-[#d1d1d1a7] text-white py-2 rounded-xl font-semibold transition-ease-300"
          >
            <div>Continue</div>
            <ArrowRight size={20} weight="regular" />
          </button>

          <div onClick={() => router.push('/signup')} className="text-gray-400 text-sm cursor-pointer">
            <span className="font-medium hover:underline underline-offset-2">Don&apos;t have an account?</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
