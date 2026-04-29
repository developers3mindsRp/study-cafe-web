import type { GetServerSideProps } from 'next';

export default function LegacyDownloadsAccountsRedirect() {
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
