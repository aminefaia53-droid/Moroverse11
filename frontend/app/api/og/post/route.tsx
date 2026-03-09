import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params
        const userName = searchParams.get('user') ?? 'MoroVerse Explorer';
        const location = searchParams.get('location') ?? 'Morocco';
        const content = searchParams.get('content') ?? 'Shared an amazing experience!';
        const bgImage = searchParams.get('image') ?? 'https://moroverse.vercel.app/hero-bg.png';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: '1200px 630px',
                        backgroundPosition: 'center',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Overlay to darken background */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            border: '2px solid rgba(197, 160, 89, 0.4)',
                            borderRadius: '30px',
                            padding: '60px',
                            maxWidth: '900px',
                            zIndex: 10,
                        }}
                    >
                        {/* Logo / Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                marginBottom: '30px',
                            }}
                        >
                            <div
                                style={{
                                    color: '#C5A059',
                                    fontSize: 24,
                                    letterSpacing: '0.6em',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}
                            >
                                MOROVERSE
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            style={{
                                fontSize: 60,
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: '20px',
                                lineHeight: 1.2,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            "{content}"
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginTop: '30px',
                            }}
                        >
                            <div
                                style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                }}
                            >
                                {userName}
                            </div>
                            <div
                                style={{
                                    color: '#C5A059',
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                }}
                            >
                                •
                            </div>
                            <div
                                style={{
                                    color: '#C5A059',
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                📍 {location}
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.error(e);
        return new Response('Failed to generate OG image', { status: 500 });
    }
}
