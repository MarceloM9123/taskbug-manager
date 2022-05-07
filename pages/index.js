import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div >
      <button onClick={() => toast.success('hello toast!')}>
        Toast me
      </button>
    </div>
  );
}
