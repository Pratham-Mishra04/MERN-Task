import { Exhibition } from '@/types';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  exhibition: Exhibition;
  size?: number | string;
}

const DiscoverCard = ({ exhibition, size = 72 }: Props) => {
  const variants = [
    'w-80',
    'w-80',
    'w-72',
    'w-64',
    'w-[22vw]',
    'w-[24vw]',
    'w-56',
    'w-80',
    'h-80',
    'h-72',
    'h-64',
    'h-56',
    'h-[22vw]',
    'h-[24vw]',
  ];
  return (
    <Link
      href={`/user?userID=${exhibition.userID}`}
      className={`w-${size} h-${size} max-lg:w-60 max-lg:h-60 max-md:w-72 max-md:h-72 rounded-sm relative group cursor-pointer transition-ease-out-500`}
    >
      <div className="w-full h-full rounded-sm overflow-clip p-4 text-sm backdrop-blur-lg text-white absolute top-0 left-0 bg-gradient-to-b from-[#00000080] z-[5] to-transparent opacity-0 group-hover:opacity-100 transition-ease-300"></div>
      <div className="w-full h-full rounded-sm overflow-clip p-4 text-sm fade-img backdrop-blur-sm text-white absolute top-0 left-0 z-[5] opacity-0 group-hover:opacity-100 transition-ease-300">
        <div className="font-bold mb-2">{exhibition.title}</div>
        <div>{exhibition.description}</div>
      </div>
      <Image
        crossOrigin="anonymous"
        className="w-full h-full rounded-sm object-cover absolute top-0 left-0 "
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions/${exhibition.image}`}
        alt="Project Cover"
        width={10000}
        height={10000}
      />
      <div className="w-full glassMorphism text-white rounded-b-lg font-sans absolute bottom-0 right-0 flex flex-col px-4 py-2">
        <div className={`${Number(size) <= 64 ? 'text-base' : size == 72 ? 'text-lg' : 'text-xl'}`}>
          {exhibition.title}
        </div>
        <div className={`w-full line-clamp-1 ${Number(size) <= 64 ? 'text-xs' : 'text-sm'}`}>
          {exhibition.user?.name}
        </div>
      </div>
    </Link>
  );
};

export default DiscoverCard;
