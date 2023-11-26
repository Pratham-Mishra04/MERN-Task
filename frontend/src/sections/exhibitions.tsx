import ExhibitionCard from '@/components/exhibition_card';
import Loader from '@/components/loader';
import getHandler from '@/handlers/get_handler';
import { Exhibition } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';
import { PlusCircle } from '@phosphor-icons/react';
import NewExhibition from './new_exhibition';
import EditExhibition from './edit_exhibition';
import deleteHandler from '@/handlers/delete_handler';
import ConfirmDelete from '@/components/confirm_delete';

interface Props {
  userID: string;
}

const initialExhibition: Exhibition = {
  id: '',
  category: '',
  createdAt: new Date(),
  description: '',
  image: '',
  title: '',
  userID: '',
  user: null,
};

const Exhibitions = ({ userID }: Props) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [clickedOnNewExhibition, setClickedOnNewExhibition] = useState(false);
  const [clickedOnEditExhibition, setClickedOnEditExhibition] = useState(false);
  const [clickedOnDeleteExhibition, setClickedOnDeleteExhibition] = useState(false);
  const [clickedExhibition, setClickedExhibition] = useState(initialExhibition);

  const fetchExhibitions = async () => {
    const res = await getHandler(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions?user=${userID}&page=${page}&limit=${10}`
    );
    if (res.statusCode == 200) {
      const addedExhibitions = [...exhibitions, ...(res.data.exhibitions || [])];
      if (addedExhibitions.length === exhibitions.length) setHasMore(false);
      setExhibitions(addedExhibitions);
      setPage(prev => prev + 1);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error('Internal Server Error');
    }
  };

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting your Exhibition...');

    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions/${clickedExhibition.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      setExhibitions(prev => prev.filter(e => e.id != clickedExhibition.id));
      setClickedOnDeleteExhibition(false);
      Toaster.stopLoad(toaster, 'Exhibition Deleted', 1);
    } else {
      Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const loggedInUserID = Cookies.get('id');

  return (
    <>
      {clickedOnNewExhibition ? (
        <NewExhibition setShow={setClickedOnNewExhibition} setExhibitions={setExhibitions} />
      ) : (
        <></>
      )}
      {clickedOnEditExhibition ? (
        <EditExhibition
          setShow={setClickedOnEditExhibition}
          exhibition={clickedExhibition}
          setExhibitions={setExhibitions}
        />
      ) : (
        <></>
      )}
      {clickedOnDeleteExhibition ? (
        <ConfirmDelete handleDelete={handleDelete} setShow={setClickedOnDeleteExhibition} />
      ) : (
        <></>
      )}
      <div className="w-full flex flex-col items-center py-32">
        <div className="flex items-center gap-4">
          <div className="font-primary text-8xl font-semibold">Exhibitions</div>
          {userID == loggedInUserID ? (
            <PlusCircle onClick={() => setClickedOnNewExhibition(true)} className="cursor-pointer" size={40} />
          ) : (
            <></>
          )}
        </div>
        {loading ? (
          <Loader />
        ) : exhibitions.length > 0 ? (
          <InfiniteScroll
            className="w-full flex flex-col px-64 mt-16"
            dataLength={exhibitions.length}
            next={() => fetchExhibitions()}
            hasMore={hasMore}
            loader={<Loader />}
          >
            {exhibitions.map((exhibition, index) => {
              return (
                <ExhibitionCard
                  key={exhibition.id}
                  index={index}
                  exhibition={exhibition}
                  setClickedExhibition={setClickedExhibition}
                  setClickedOnEditExhibition={setClickedOnEditExhibition}
                  setClickedOnDeleteExhibition={setClickedOnDeleteExhibition}
                />
              );
            })}
          </InfiniteScroll>
        ) : (
          <div className="mt-8 text-primary text-2xl font-secondary">Nothing Here :)</div>
        )}
      </div>
    </>
  );
};

export default Exhibitions;
