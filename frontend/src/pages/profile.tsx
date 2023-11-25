import Header from '@/components/header';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Protect from '@/utils/protect';
import { User } from '@/types';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Exhibitions from '@/sections/exhibitions';

const initialUser: User = {
  id: '',
  name: '',
  username: '',
  tagline: '',
  bio: '',
  profilePic: 'default.jpg',
  coverPic: 'default.jpg',
};

const Profile = () => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await getHandler(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`);
    if (res.statusCode == 200) {
      setUser(res.data.user);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error('Internal Server Error');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Header index={1} />
      <div className="w-full p-16 flex justify-end items-center relative gap-8 bg-gray-100">
        <div className="w-2/5 flex flex-col gap-4 z-10">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profilePics/${user.profilePic}`}
            alt=""
            width={10000}
            height={10000}
            className="w-40 h-40 rounded-full shadow-2xl"
          />
          <div className="w-full overflow-ellipsis font-primary font-medium text-8xl">{user.name}</div>
          <div className="text-secondary font-secondary uppercase text-xl">{user.tagline}</div>
          <div className="font-secondary">{user.bio}</div>
        </div>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/coverPics/${user.profilePic}`}
          alt=""
          width={10000}
          height={10000}
          className="w-3/5 shadow-2xl rounded-sm"
        />
      </div>
      <Exhibitions userID={user.id} />
    </div>
  );
};

export default Protect(Profile);
