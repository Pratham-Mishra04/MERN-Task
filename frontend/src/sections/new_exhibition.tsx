import postHandler from '@/handlers/post_handler';
import { Exhibition } from '@/types';
import Toaster from '@/utils/toaster';
import { X } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { resizeImage } from '@/utils/resize_image';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setExhibitions: React.Dispatch<React.SetStateAction<Exhibition[]>>;
}

const NewExhibition = ({ setShow, setExhibitions }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Some Category');
  const [image, setImage] = useState<File>();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

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
    // if (category.trim() == '' || category == 'Select Category') {
    //   Toaster.error('Select Category');
    //   return;
    // }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding your Exhibition...');

    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (image) formData.append('image', image);

    const res = await postHandler(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions`,
      formData,
      'multipart/form-data'
    );

    if (res.statusCode === 201) {
      const exhibition = res.data.exhibition;
      setExhibitions(prev => [...prev, exhibition]);
      Toaster.stopLoad(toaster, 'Exhibition Added', 1);
      setShow(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
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

      URL.revokeObjectURL(selectedImageUrl);
    };
  }, []);

  //   const categories = ['Select Category', 'Art', 'Tech'];

  return (
    <>
      <div className="fixed w-1/2 h-2/3 bg-white flex justify-between rounded-lg p-8 gap-8 overflow-y-auto border-[1px] border-primary top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 shadow-2xl animate-fade_third z-50">
        {/* <X onClick={() => setShow(false)} className="absolute top-2 right-2 cursor-pointer" weight="bold" size={32} /> */}
        <div className="w-64 h-64 flex flex-col items-center gap-4">
          <input
            type="file"
            className="hidden"
            id="image"
            multiple={false}
            onChange={async ({ target }) => {
              if (target.files && target.files.length > 0) {
                if (target.files[0].type.split('/')[0] === 'image') {
                  try {
                    const resizedPic = await resizeImage(target.files[0], 1080, 1080);
                    setSelectedImageUrl(URL.createObjectURL(resizedPic));
                    setImage(resizedPic);
                  } catch (error) {
                    console.error('Error while resizing image:', error);
                    return null;
                  }
                } else {
                  Toaster.error('Only Images allowed');
                  return null;
                }
              }
            }}
          />

          <label className="w-full h-full" htmlFor="image">
            {selectedImageUrl == '' ? (
              <div className="w-full h-full rounded-xl bg-secondary flex-center transition-ease-500 cursor-pointer">
                Click here to add cover picture
              </div>
            ) : (
              <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt="project cover"
                src={selectedImageUrl}
                className="rounded-xl w-full h-full cursor-pointer object-contain"
              />
            )}
          </label>
        </div>

        <div className="w-3/5 h-full flex flex-col justify-between gap-2">
          <div className="w-full h-fit flex flex-col gap-6">
            <div className="w-full text-primary flex flex-col gap-4 pb-8 max-lg:pb-4">
              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Exhibition Title ({title.trim().length}/25)
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

              {/* <select
                onChange={el => setCategory(el.target.value)}
                className="w-1/2 max-lg:w-full h-12 border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:text-white bg-primary_comp dark:bg-[#10013b30] focus:outline-nonetext-sm rounded-lg block p-2"
              >
                {categories.map((c, i) => {
                  return (
                    <option className="bg-primary_comp_hover dark:bg-[#10013b30]" key={i} value={c}>
                      {c}
                    </option>
                  );
                })}
              </select> */}

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
            className="bg-secondary mt-12 bg-opacity-30 hover:bg-opacity-50 active:bg-opacity-60 cursor-pointer text-primary font-medium h-14 rounded-xl p-2 flex-center transition-ease-300"
          >
            Create Exhibition
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

export default NewExhibition;
