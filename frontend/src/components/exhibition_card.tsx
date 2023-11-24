import React from 'react';
import Image from 'next/image';

interface Props {
  index: number;
}

const ExhibitionCard = ({ index }: Props) => {
  return (
    <div className={`w-full flex ${index % 2 == 0 ? '' : 'flex-row-reverse'} items-center gap-20 py-20`}>
      <Image src={'/test.jpg'} alt="" width={10000} height={10000} className="w-96 h-96 rounded-sm shadow-2xl" />
      <div className="w-[calc(100%-288px)] flex flex-col gap-8">
        <div className="flex items-center gap-8">
          <div className="text-secondary">NOVEMBER 24</div>
          <div className="w-48 h-[1px] bg-secondary"></div>
        </div>
        <div className="w-full overflow-ellipsis font-primary font-medium text-6xl">Lorem ipsum dolor sit.</div>
        <div className="font-secondary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro accusantium pariatur tempora debitis maxime
          officiis sunt consequuntur asperiores ex illum culpa optio id, voluptatem perspiciatis iure ipsa esse .
        </div>
      </div>
    </div>
  );
};

export default ExhibitionCard;
