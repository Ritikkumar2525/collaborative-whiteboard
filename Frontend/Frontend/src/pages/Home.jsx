import Navbar from './Navbar'
import Hero from './Hero'
import Problems from './Problems'
import Solutions from './Solutions'
import Usecases from './Usecases'
import FinalCta from './FinalCta'
import Footer from './Footer'

const Home = () => {
  return (
    <div className='w-full min-h-screen bg-zinc-50 text-zinc-900'>
      <Navbar/>
      <Hero />
      <Problems />
      <Solutions />
      <Usecases />
      <FinalCta />
      <Footer />
    </div>
  )
}

export default Home