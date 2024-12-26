import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Uh oh! Looks like you may have gotten lost.</h1>
            <p> How about you
                <Link href="https://jmfcpallc.pinkcarbon.com">
                    <a>go back home</a>
                </Link> for now.
            </p>
        </div>
    );
}
