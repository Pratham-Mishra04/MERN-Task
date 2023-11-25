import ExhibitionCard from '@/components/exhibition_card';
import Loader from '@/components/loader';
import getHandler from '@/handlers/get_handler';
import { Exhibition } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  userID: string;
}

const Exhibitions = ({ userID }: Props) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-32">
      <div className="font-primary text-8xl font-semibold">Exhibitions</div>
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
            return <ExhibitionCard key={exhibition.id} index={index} />;
          })}
        </InfiniteScroll>
      ) : (
        <div className="mt-8 text-primary text-2xl font-secondary">Nothing Here :)</div>
      )}
    </div>
  );
};

export default Exhibitions;
