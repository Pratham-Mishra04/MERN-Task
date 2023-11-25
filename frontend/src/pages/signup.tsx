import configuredAxios from '@/config/axios';
import Toaster from '@/utils/toaster';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Cookies from 'js-cookie';
import { Eye, EyeClosed, ArrowRight } from '@phosphor-icons/react';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mutex, setMutex] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (name.trim().length == 0 || !/^[a-z][a-z\s]*/.test(name.trim().toLowerCase())) {
      Toaster.error('Enter a Valid Name');
      return;
    }
    if (!isEmail(email)) {
      Toaster.error('Enter a Valid Email');
      return;
    }
    if (username.trim().length < 4) {
      Toaster.error('Username too short');
      return;
    } else if (!/^([a-z][a-z0-9_]{4,})$/.test(username.trim().toLowerCase())) {
      Toaster.error('Enter a Valid Username');
      return;
    }

    if (password != confirmPassword) {
      Toaster.error('Passwords do not match');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('username', username.trim().toLowerCase());
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    const toaster = Toaster.startLoad('Creating your Account...');

    await configuredAxios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, formData, {
        withCredentials: true,
      })
      .then(res => {
        if (res.status === 201) {
          Toaster.stopLoad(toaster, 'Account created!', 1);
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
    <div className="w-1/2 mx-auto flex flex-col gap-12 py-32">
      <div className="font-primary text-7xl font-medium text-center text-primary">Register Now</div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex justify-between gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              <div className="font-medium">Name</div>
              <input
                name="name"
                maxLength={25}
                value={name}
                onChange={el => setName(el.target.value)}
                type="text"
                className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
              />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <div className="font-medium">Username</div>
              <input
                name="username"
                maxLength={16}
                value={username}
                onChange={el => setUsername(el.target.value.toLowerCase())}
                type="text"
                className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="font-medium">Email</div>
            <input
              name="email"
              value={email}
              onChange={el => setEmail(el.target.value)}
              type="email"
              className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
            />
          </div>

          <div className="w-full flex justify-between gap-4">
            <div className="w-1/2 flex flex-col gap-2">
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
            <div className="w-1/2 flex flex-col gap-2">
              <div className="font-medium">Confirm Password</div>
              <div className="w-full relative">
                <input
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={el => setConfirmPassword(el.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full bg-white p-2 rounded-xl focus:outline-none focus:bg-white border-2 text-gray-400 pr-10"
                />
                {showConfirmPassword ? (
                  <Eye
                    onClick={() => setShowConfirmPassword(false)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    size={20}
                    weight="regular"
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setShowConfirmPassword(true)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    size={20}
                    weight="regular"
                  />
                )}
              </div>
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

          <div onClick={() => router.push('/login')} className="text-gray-400 text-sm cursor-pointer">
            <span className="font-medium hover:underline underline-offset-2">Already have an Account?</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
