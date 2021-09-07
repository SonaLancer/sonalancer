import Link from 'next/link';

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