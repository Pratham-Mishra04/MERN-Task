import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Cookies from 'js-cookie';

interface Props {
  index: number;
}

const Header = ({ index }: Props) => {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove('id');
    Cookies.remove('token');

    router.replace('/login');
  };
  return (
    <div className="w-full h-24 bg-white bg-opacity-50 backdrop-blur-md sticky top-0 flex justify-between items-center px-16 border-b-[1px] border-gray-200 z-50">
      <div className="text-3xl font-primary font-bold text-primary">MERNary</div>
      <div className="absolute right-1/2 translate-x-1/2 flex items-center gap-6 font-secondary text-2xl">
        <Link href={'/'} className={`${index == 0 ? 'text-secondary' : 'text-primary'} transition-ease-500`}>
          DISCOVER
        </Link>
        <Link href={'/profile'} className={`${index == 1 ? 'text-secondary' : 'text-primary'} transition-ease-500`}>
          MY PROFILE
        </Link>
      </div>
      <div onClick={handleLogout} className="font-secondary text-2xl cursor-pointer">
        LOG OUT
      </div>
    </div>
  );
};

export default Header;
