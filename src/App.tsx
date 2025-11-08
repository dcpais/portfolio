import NightSky from './components/NightSky'

const App = () => {
  return (
    <div className="app">
      <NightSky />
      <header className="overlay">
        <div className="content">
          <p className="eyebrow">Welcome aboard</p>
          <h1>
            Deepp&apos;s <span>Cosmic Portfolio</span>
          </h1>
          <p className="tagline">
            Explore skills, projects, and adventures through an interactive space themed experience.
          </p>
        </div>
      </header>
    </div>
  )
}

export default App

