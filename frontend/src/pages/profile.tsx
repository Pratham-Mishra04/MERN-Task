import Header from '@/components/header';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Protect from '@/utils/protect';
import { User } from '@/types';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Exhibitions from '@/sections/exhibitions';
import patchHandler from '@/handlers/patch_handler';
import { Check, ImageSquare, PencilSimple, X } from '@phosphor-icons/react';
import { resizeImage } from '@/utils/resize_image';
import Loader from '@/components/loader';

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

const Profile = () => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [tagline, setTagline] = useState('');

  const [userPic, setUserPic] = useState<File>();
  const [userPicView, setUserPicView] = useState<string>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/coverPics/default.jpg`
  );
  const [coverPic, setCoverPic] = useState<File>();
  const [coverPicView, setCoverPicView] = useState(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/coverPics/default.jpg`
  );

  const [clickedOnName, setClickedOnName] = useState(false);
  const [clickedOnBio, setClickedOnBio] = useState(false);
  const [clickedOnTagline, setClickedOnTagline] = useState(false);
  const [clickedOnProfilePic, setClickedOnProfilePic] = useState(false);
  const [clickedOnCoverPic, setClickedOnCoverPic] = useState(false);

  const [mutex, setMutex] = useState(false);

  const fetchUser = async () => {
    const res = await getHandler(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`);
    if (res.statusCode == 200) {
      setUser(res.data.user);

      setName(res.data.user?.name || '');
      setTagline(res.data.user?.tagline || '');
      setBio(res.data.user?.bio || '');
      setUserPicView(
        res.data.user?.profilePic
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profilePics/${res.data.user.profilePic}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profilePics/default.jpg`
      );
      setCoverPicView(
        res.data.user?.coverPic
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/coverPics/${res.data.user.coverPic}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/coverPics/default.jpg`
      );

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error('Internal Server Error');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (field: string) => {
    if (name.trim() == '') {
      Toaster.error('Name Cannot be empty', 'validation_toaster');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating your Profile...');
    const formData = new FormData();

    if (field == 'coverPic' && coverPic) formData.append('coverPic', coverPic);
    else if (field == 'userPic' && userPic) formData.append('profilePic', userPic);
    else if (field == 'name') formData.append('name', name);
    else if (field == 'bio') formData.append('bio', bio);
    else if (field == 'tagline') formData.append('tagline', tagline);

    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`;

    const res = await patchHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 200) {
      setUser(res.data.user);
      Toaster.stopLoad(toaster, 'Profile Updated', 1);

      if (field == 'name') setClickedOnName(false);
      else if (field == 'bio') setClickedOnBio(false);
      else if (field == 'tagline') setClickedOnTagline(false);
      else if (field == 'userPic') setClickedOnProfilePic(false);
      else if (field == 'coverPic') setClickedOnCoverPic(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
      }
    }
    setMutex(false);
  };

  interface SaveBtnProps {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    field: string;
  }

  const SaveBtn = ({ setter, field }: SaveBtnProps) => {
    const checker = () => {
      if (field == 'name') return name == user.name;
      else if (field == 'bio') return bio == user.bio;
      else if (field == 'tagline') return tagline == user.tagline;
      return true;
    };
    return (
      <div className="w-full flex text-sm justify-end gap-2 mt-2">
        <div
          onClick={() => setter(false)}
          className="border-[1px] border-primary_black flex-center rounded-full w-20 p-1 cursor-pointer"
        >
          Cancel
        </div>
        {checker() ? (
          <div className="bg-primary bg-opacity-50 text-white flex-center rounded-full w-16 p-1 cursor-default">
            Save
          </div>
        ) : (
          <div
            onClick={() => handleSubmit(field)}
            className="bg-primary text-white flex-center rounded-full w-16 p-1 cursor-pointer"
          >
            Save
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Header index={1} />
      <div className="w-full p-16 flex justify-end items-center relative gap-8 bg-gray-100">
        <div className="w-2/5 flex flex-col gap-2 z-10">
          <input
            type="file"
            className="hidden"
            id="userPic"
            multiple={false}
            onChange={async ({ target }) => {
              if (target.files && target.files[0]) {
                const file = target.files[0];
                if (file.type.split('/')[0] == 'image') {
                  const resizedPic = await resizeImage(file, 500, 500);
                  setUserPicView(URL.createObjectURL(resizedPic));
                  setUserPic(resizedPic);
                  setClickedOnProfilePic(true);
                } else Toaster.error('Only Image Files can be selected');
              }
            }}
          />
          {clickedOnProfilePic ? (
            <div className="relative">
              <div className="w-48 h-48 border-2 border-dotted border-primary max-md:w-40 max-md:h-40 absolute -top-4 -left-4 animate-spin rounded-full"></div>
              <div
                onClick={() => handleSubmit('userPic')}
                className="w-40 h-20 absolute border-b-2 border-black top-0 left-0 rounded-tl-full rounded-tr-full flex-center bg-white transition-ease-200 cursor-pointer opacity-0 hover:opacity-50"
              >
                <Check color="black" size={32} />
              </div>
              <div
                onClick={() => {
                  setClickedOnProfilePic(false);
                  setUserPicView(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profilePics/${user.profilePic}`);
                  setUserPic(undefined);
                }}
                className="w-40 h-20 max-md:w-32 max-md:h-32 absolute border-b-2 border-black bottom-0 left-0 rotate-180 rounded-tl-full rounded-tr-full flex-center bg-white transition-ease-200 cursor-pointer opacity-0 hover:opacity-50"
              >
                <X color="black" size={32} />
              </div>
              <Image
                crossOrigin="anonymous"
                className="w-40 h-40 rounded-full object-cover transition-ease-200 cursor-pointer max-md:w-32 max-md:h-32"
                width={10000}
                height={10000}
                alt="/"
                src={userPicView}
              />
            </div>
          ) : (
            <label className="w-40 h-40 rounded-full relative" htmlFor="userPic">
              <div className="w-40 h-40 absolute top-0 left-0 rounded-full flex-center bg-white transition-ease-200 cursor-pointer opacity-0 hover:opacity-50">
                <PencilSimple color="black" size={32} />
              </div>
              <Image
                crossOrigin="anonymous"
                className="w-40 h-40 rounded-full shadow-2xl object-cover cursor-pointer"
                width={10000}
                height={10000}
                alt="/"
                src={userPicView}
              />
            </label>
          )}

          {clickedOnName ? (
            <div className="w-full">
              <div className="text-xs ml-1 font-medium uppercase text-gray-500">Name ({name.trim().length}/25)</div>
              <input
                maxLength={25}
                value={name}
                onChange={el => setName(el.target.value)}
                placeholder="Interact User"
                className="w-full text-primary_black focus:outline-none border-[1px] rounded-lg text-2xl p-2 font-semibold bg-transparent"
              />
              <SaveBtn setter={setClickedOnName} field="name" />
            </div>
          ) : (
            <div
              onClick={() => setClickedOnName(true)}
              className="w-full relative group rounded-lg flex-center p-2 hover:bg-secondary hover:bg-opacity-40 cursor-pointer transition-ease-300"
            >
              <PencilSimple className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 transition-ease-300" />
              <div className="w-full overflow-ellipsis font-primary font-medium text-8xl">{user.name}</div>
            </div>
          )}

          {clickedOnTagline ? (
            <div className="w-full">
              <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                Tagline ({tagline.trim().length}/50)
              </div>
              <input
                maxLength={50}
                value={tagline}
                onChange={el => setTagline(el.target.value)}
                placeholder="Some Tagline"
                className="w-full text-secondary font-secondary uppercase text-xl focus:outline-none border-[1px] rounded-lg p-2 font-medium bg-transparent"
              />
              <SaveBtn setter={setClickedOnTagline} field="tagline" />
            </div>
          ) : (
            <div
              onClick={() => setClickedOnTagline(true)}
              className="w-full relative group rounded-lg flex-center p-2 hover:bg-secondary hover:bg-opacity-40 cursor-pointer transition-ease-300"
            >
              <PencilSimple className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 transition-ease-300" />
              <div className="w-full text-secondary font-secondary uppercase text-xl">
                {user.tagline || 'Add A Tagline'}
              </div>
            </div>
          )}

          {clickedOnBio ? (
            <div className="w-full">
              <div className="text-xs ml-1 font-medium uppercase text-gray-500">Bio ({bio.trim().length}/500)</div>
              <textarea
                value={bio}
                onChange={el => setBio(el.target.value)}
                placeholder="add a short bio"
                maxLength={500}
                className="w-full min-h-[160px] max-h-[200px] focus:outline-none text-primary_black border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-2 text-sm bg-transparent"
              />
              <SaveBtn setter={setClickedOnBio} field="bio" />
            </div>
          ) : (
            <div
              onClick={() => setClickedOnBio(true)}
              className="w-full relative group rounded-lg flex-center p-2 hover:bg-secondary hover:bg-opacity-40 cursor-pointer transition-ease-300"
            >
              <PencilSimple className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 transition-ease-300" />

              <div className="w-full font-secondary cursor-pointer">{user.bio || 'Click here to add a short bio!'}</div>
            </div>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          id="coverPic"
          multiple={false}
          onChange={async ({ target }) => {
            if (target.files && target.files[0]) {
              const file = target.files[0];
              if (file.type.split('/')[0] == 'image') {
                const resizedPic = await resizeImage(file, 1920, 1320);
                setCoverPicView(URL.createObjectURL(resizedPic));
                setCoverPic(resizedPic);
                setClickedOnCoverPic(true);
              } else Toaster.error('Only Image Files can be selected');
            }
          }}
        />

        {clickedOnCoverPic ? (
          <>
            <div
              onClick={() => handleSubmit('coverPic')}
              className="w-10 h-10 absolute top-1 right-12 mt-navbar rounded-full z-20 flex-center bg-white transition-ease-200 cursor-pointer opacity-50 hover:opacity-75"
            >
              <Check color="black" size={24} />
            </div>
            <div
              onClick={() => {
                setCoverPicView(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/coverPics/${user.coverPic}`);
                setCoverPic(undefined);
                setClickedOnCoverPic(false);
              }}
              className="w-10 h-10 absolute top-1 right-1 mt-navbar rounded-full z-20 flex-center bg-white transition-ease-200 cursor-pointer opacity-50 hover:opacity-75"
            >
              <X color="black" size={24} />
            </div>
            <Image
              crossOrigin="anonymous"
              className="w-3/5 shadow-2xl rounded-sm"
              width={10000}
              height={10000}
              alt="/"
              src={coverPicView}
            />
          </>
        ) : (
          <>
            <label
              htmlFor="coverPic"
              className="w-12 h-12 absolute top-1 right-4 mt-navbar rounded-full z-20 flex-center bg-white transition-ease-200 cursor-pointer opacity-50 hover:opacity-75"
            >
              <PencilSimple className="max-lg:hidden" color="black" size={24} />
              <ImageSquare className="lg:hidden" color="black" size={24} />
            </label>

            <Image
              crossOrigin="anonymous"
              className="w-3/5 shadow-2xl rounded-sm"
              width={10000}
              height={10000}
              alt="/"
              src={coverPicView}
            />
          </>
        )}
      </div>
      {loading ? <></> : <Exhibitions userID={user.id} />}
    </div>
  );
};

export default Protect(Profile);
