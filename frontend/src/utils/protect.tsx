import React, { ComponentType, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Toaster from './toaster';

const Protect = <Props extends Object>(Component: ComponentType<Props>) => {
  const ProtectedComponent = (props: Props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(0);
    useEffect(() => {
      const token = Cookies.get('token');
      if (!token || token == '') {
        Toaster.error('You are not logged in.');
        setIsAuthenticated(0);
        router.push('/login');
      } else setIsAuthenticated(1);
    }, []);

    if (isAuthenticated === 1) return <Component {...props} />;
    return <></>;
  };
  return ProtectedComponent;
};

export default Protect;
