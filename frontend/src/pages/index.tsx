import Header from '@/components/header';

export default function Home() {
  return (
    <div>
      <Header index={0} />
      <div className="w-full flex flex-col items-center mt-32">
        <div className="font-secondary text-3xl uppercase tracking-widest text-secondary">Explore Our</div>
        <div className="font-primary text-9xl font-semibold">Collection</div>
        <div className="w-[1px] h-32 mt-8 bg-secondary"></div>
      </div>
    </div>
  );
}
