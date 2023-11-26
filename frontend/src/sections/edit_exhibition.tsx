import postHandler from '@/handlers/post_handler';
import { Exhibition } from '@/types';
import Toaster from '@/utils/toaster';
import { X } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { resizeImage } from '@/utils/resize_image';
import patchHandler from '@/handlers/patch_handler';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  exhibition: Exhibition;
  setExhibitions: React.Dispatch<React.SetStateAction<Exhibition[]>>;
}

const EditExhibition = ({ setShow, exhibition, setExhibitions }: Props) => {
  const [title, setTitle] = useState(exhibition.title);
  const [description, setDescription] = useState(exhibition.description);

  const [mutex, setMutex] = useState(false);

  const handleSubmit = async () => {
    if (title.trim() == '') {
      Toaster.error('Enter Title');
      return;
    }
    if (description.trim() == '') {
      Toaster.error('Enter Description');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your Exhibition...');

    const formData = {
      title,
      description,
    };

    const res = await patchHandler(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions/${exhibition.id}`, formData);

    if (res.statusCode === 200) {
      setExhibitions(prev =>
        prev.map(e => {
          if (e.id == exhibition.id) return { ...e, title, description };
          else return e;
        })
      );
      Toaster.stopLoad(toaster, 'Exhibition Edited', 1);
      setShow(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
    }
    setMutex(false);
  };

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <>
      <div className="fixed w-1/2 h-2/3 bg-white flex justify-between rounded-lg p-8 gap-8 overflow-y-auto border-[1px] border-primary top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 shadow-2xl animate-fade_third z-50">
        <X
          onClick={() => setShow(false)}
          className="lg:hidden absolute top-2 right-2 cursor-pointer"
          weight="bold"
          size={32}
        />

        <div className="w-full h-full flex flex-col justify-between gap-2">
          <div className="w-full h-fit flex flex-col gap-6">
            <div className="w-full text-primary flex flex-col gap-4 pb-8 max-lg:pb-4">
              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Exhibition Title ({description.trim().length}/25)
                </div>
                <input
                  value={title}
                  onChange={el => setTitle(el.target.value)}
                  maxLength={25}
                  type="text"
                  placeholder="Untitled Exhibition"
                  className="w-full text-xl font-semibold border-gray-400 border-[1px] rounded-lg p-2 bg-transparent focus:outline-none"
                />
              </div>

              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Exhibition Description ({description.trim().length}/500)
                </div>
                <textarea
                  value={description}
                  onChange={el => setDescription(el.target.value)}
                  maxLength={500}
                  className="w-full min-h-[80px] max-h-80 bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
                  placeholder="Explain your project"
                />
              </div>
            </div>
          </div>

          <div
            onClick={handleSubmit}
            className="bg-secondary bg-opacity-30 hover:bg-opacity-50 active:bg-opacity-60 cursor-pointer text-primary font-medium h-14 rounded-xl p-2 flex-center transition-ease-300"
          >
            Edit Exhibition
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default EditExhibition;
