import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

export default () => {
  console.log('🔥 SignoutPage: Component function called');

  const { doRequest, errors } = useRequest({
    url: '/api/auth/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      console.log('🔥 useRequest onSuccess called');
      console.log('🔥 About to redirect using window.location.href');
      
      // Use window.location instead of Router.push to avoid React navigation issues
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  });

  useEffect(() => {
    console.log('🔥 useEffect: Calling doRequest');
      doRequest();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }}>
      Signing out... Please wait.
    </div>
  );
};