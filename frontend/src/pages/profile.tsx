import Header from '@/components/header';
import React from 'react';
import Image from 'next/image';
import ExhibitionCard from '@/components/exhibition_card';

const Profile = () => {
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
      <div className="w-full flex flex-col items-center py-32">
        <div className="font-primary text-8xl font-semibold">Exhibitions</div>
        <div className="w-full flex flex-col px-64 mt-16">
          <ExhibitionCard index={0} />
          <ExhibitionCard index={1} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
