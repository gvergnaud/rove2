import { Player } from '../../components/Player';
import copy from '../../copy';
import Head from 'next/head';

export default function VideoName({ videoName }) {
  return (
    <>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <title>{copy.home.meta.title}</title>
        <meta name="title" content={copy.home.meta.title} />
        <meta name="description" content={copy.home.meta.description} />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={copy.home.meta.url} />
        <meta property="og:title" content={copy.home.meta.title} />
        <meta property="og:description" content={copy.home.meta.description} />
        <meta property="og:image" content={copy.home.meta.image} />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={copy.home.meta.url} />
        <meta property="twitter:title" content={copy.home.meta.title} />
        <meta
          property="twitter:description"
          content={copy.home.meta.description}
        />
        <meta property="twitter:image" content={copy.home.meta.image} />
      </Head>
      <Player videoName={videoName} />
    </>
  );
}

VideoName.getInitialProps = async ({ query }) => {
  return { videoName: query.videoName };
};
