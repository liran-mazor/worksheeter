import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import Head from 'next/head';
import buildClient from '../api/build-client';
import Header from '../components/header';
import Footer from '../components/footer';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <title>Worksheeter - AI-Powered Learning Platform</title>
        <meta name="description" content="Transform your study process with AI-powered worksheet analysis, keyword extraction, and instant question answering" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="app-container">
        <Header currentUser={currentUser} />
        <main className="main-content">
          <Component currentUser={currentUser} {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let currentUser = null;

  try {
    const { data } = await client.get('/api/auth/users/currentuser');
    currentUser = data.currentUser;
  } catch (error) {
    console.log('User not authenticated or service unavailable');
  }

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      currentUser
    );
  }

  return {
    pageProps,
    currentUser,
  };
};

export default AppComponent;