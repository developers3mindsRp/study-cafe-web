import type { GetServerSideProps } from 'next';

/**
 * Legacy URL from the static mock. File detail lives at /downloads/file/[slug].
 */
export default function LegacyDownloadsDetailsRedirect() {
    return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/downloads',
            permanent: false,
        },
    };
};
