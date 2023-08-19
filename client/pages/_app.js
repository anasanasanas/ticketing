import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div >
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    try {
        const { data } = await client.get('/api/users/currentuser');
        const pageProps = await appContext?.Component?.getInitialProps(appContext.ctx);
        return {
            pageProps,
            ...data
        }
    } catch (err) { }
    return {};
}

export default AppComponent;