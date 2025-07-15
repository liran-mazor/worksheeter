import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import Head from 'next/head';
import buildClient from '../api/build-client';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import PageTransition from '../components/page-transition';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Head>
        <title>Worksheeter - AI-Powered Learning Platform</title>
        <meta name="description" content="Transform your study process with AI-powered worksheet analysis, keyword extraction, and instant question answering" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <PageTransition>
        <div className="app-container">
          <Sidebar currentUser={currentUser} />
          <div className="main-layout">
            <main className="main-content">
              <Component currentUser={currentUser} {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>
      </PageTransition>

      <style jsx global>{`
        /* Prevent white flash during page transitions */
        html, body {
          background: 
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%) !important;
          color: #f1f5f9 !important;
        }

        #__next {
          background: inherit !important;
        }

        .app-container {
          display: flex;
          min-height: 100vh;
          background: inherit !important;
        }

        .main-layout {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: inherit !important;
        }

        .main-content {
          flex: 1;
          background: inherit !important;
          color: #f1f5f9 !important;
        }

        /* Force dark mode on all pages during transitions */
        .main-content * {
          background-color: transparent !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .main-layout {
            min-height: calc(100vh - 60px);
          }
        }
      `}</style>
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