import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { doRequest, errors } = useRequest({
    url: '/api/auth/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => {
      console.log('Signin successful!');
      window.location.href = '/';
    }
  });

  const onSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Sign In</h1>
            
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email Address</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
                  required
                />
            </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
            type="password"
            className="form-control"
            placeholder="Enter password"
                  required
                />
            </div>

        {errors}

            <button 
          className="btn btn-primary" 
          disabled={isLoading}
          style={{ width: '100%' }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/auth/signup">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};