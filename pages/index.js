// import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'


export default function Home() {
  return (
    <div>
      <Link prefetch={false} href={{
        pathname: '/[username]',
        query: {username:'ak123'}
      }}>
        <a>Click karo</a>
      </Link>
    </div>
  )
}