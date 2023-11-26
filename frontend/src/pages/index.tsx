import DiscoverCard from '@/components/discover_card';
import Header from '@/components/header';
import Loader from '@/components/loader';
import getHandler from '@/handlers/get_handler';
import { Exhibition } from '@/types';
import Protect from '@/utils/protect';
import Toaster from '@/utils/toaster';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchExhibitions = async () => {
    const res = await getHandler(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exhibitions?page=${page}&limit=${10}`);
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
    <div>
      <Header index={0} />
      <div className="w-full flex flex-col items-center mt-32">
        <div className="font-secondary text-3xl uppercase tracking-widest text-secondary">Explore Our</div>
        <div className="font-primary text-9xl font-semibold">Collection</div>
        <div className="w-[1px] h-32 mt-8 bg-secondary"></div>
      </div>
      <InfiniteScroll
        className="w-full grid grid-cols-4 justify-center gap-2 px-40 py-16"
        dataLength={exhibitions.length}
        next={() => fetchExhibitions()}
        hasMore={hasMore}
        loader={<Loader />}
      >
        {exhibitions.map(exhibition => {
          return <DiscoverCard key={exhibition.id} size={72} exhibition={exhibition} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Protect(Home);
