import '@/styles/globals.css';
import '@/styles/loader.css';
import '@/styles/extras.tailwind.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <ToastContainer />
      <Component {...pageProps} />
    </main>
  );
}
