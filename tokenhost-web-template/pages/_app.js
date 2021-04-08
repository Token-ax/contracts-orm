import '../styles/globals.css'
import Nav from '../components/Nav.js'
import '../assets/sass/styles.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav></Nav>
      <section className="section">
        <Component {...pageProps} />
      </section>
    </>
  )
}

export default MyApp
