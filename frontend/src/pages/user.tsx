import Header from '@/components/header';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Protect from '@/utils/protect';
import { User } from '@/types';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next/types';
import Exhibitions from '@/sections/exhibitions';

const initialUser: User = {
  id: '',
  name: '',
  username: '',
  tagline: '',
  bio: '',
  profilePic: 'default.jpg',
  coverPic: 'default.jpg',
  createdAt: new Date(),
};

interface Props {
  userID: string;
}

const UserProfile = ({ userID }: Props) => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await getHandler(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userID}`);
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
          <Image src={'/test.jpg'} alt="" width={10000} height={10000} className="w-40 h-40 rounded-full shadow-2xl" />
          <div className="w-full overflow-ellipsis font-primary font-medium text-8xl">Pratham Mishra</div>
          <div className="text-secondary font-secondary uppercase text-xl">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </div>
          <div className="font-secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro accusantium pariatur tempora debitis maxime
            officiis sunt consequuntur asperiores ex illum culpa optio id, voluptatem perspiciatis iure ipsa esse nulla,
            quas non, qui mollitia! Dicta reiciendis voluptatem voluptate, quisquam expedita rerum ut consequatur
            aliquam dolore distinctio esse nisi est similique placeat corrupti maxime aperiam ea.
          </div>
        </div>
        <Image src={'/test.jpg'} alt="" width={10000} height={10000} className="w-3/5 shadow-2xl rounded-sm" />
      </div>
      <Exhibitions userID={user.id} />
    </div>
  );
};

export default Protect(UserProfile);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { userID } = context.query;

  return {
    props: { userID },
  };
}
