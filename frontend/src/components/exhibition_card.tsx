import React from 'react';
import Image from 'next/image';
import { Exhibition } from '@/types';
import moment from 'moment';
import Cookies from 'js-cookie';
import { Pencil, PencilSimple, Trash } from '@phosphor-icons/react';

interface Props {
  index: number;
  exhibition: Exhibition;
  setClickedExhibition: React.Dispatch<React.SetStateAction<Exhibition>>;
  setClickedOnEditExhibition: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOnDeleteExhibition: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExhibitionCard = ({
  index,
  exhibition,
  setClickedExhibition,
  setClickedOnEditExhibition,
  setClickedOnDeleteExhibition,
}: Props) => {
  const userID = Cookies.get('id');
  return (
    <div className={`w-full flex ${index % 2 == 0 ? '' : 'flex-row-reverse'} items-center gap-20 py-12 relative`}>
      {exhibition.userID == userID ? (
        <>
          <PencilSimple
            onClick={() => {
              setClickedExhibition(exhibition);
              setClickedOnEditExhibition(true);
            }}
            className={`absolute top-12 ${index % 2 == 0 ? 'right-4' : 'left-4'} cursor-pointer`}
            size={24}
          />
          <Trash
            onClick={() => {
              setClickedExhibition(exhibition);
              setClickedOnDeleteExhibition(true);
            }}
            className={`absolute top-12 ${index % 2 == 0 ? 'right-12' : 'left-12'} cursor-pointer`}
            size={24}
          />
        </>
      ) : (
        <></>
      )}
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions/${exhibition.image}`}
        alt=""
        width={10000}
        height={10000}
        className="w-96 h-96 rounded-sm shadow-2xl"
      />
      <div className="w-[calc(100%-288px)] flex flex-col gap-8">
        <div className="flex items-center gap-8">
          <div className="text-secondary uppercase">{moment(exhibition.createdAt).format('MMMM DD')}</div>
          <div className="w-48 h-[1px] bg-secondary"></div>
        </div>
        <div className="w-full overflow-ellipsis font-primary font-medium text-6xl">{exhibition.title}</div>
        <div className="font-secondary">{exhibition.description}</div>
      </div>
    </div>
  );
};

export default ExhibitionCard;
