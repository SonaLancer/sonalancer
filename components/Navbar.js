import Link from 'next/link';
import img from 'next/img';

export default function Navbar(){
    const{user,username} = {};

    return(
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/" passHref={true}>
                        <button>
                            Hello
                        </button>
                    </Link>
                </li>

                {username &&(
                    <>
                        <li>
                            <Link href="/admin">
                                <button>
                                    Write posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/${username}'}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}

                {username &&(
                    <>

                    </>
                )}

            </ul>
        </nav>
    )
}