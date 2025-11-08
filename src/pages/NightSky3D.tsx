import NightSky3D from '../components/NightSky3D'

const NightSky3DPage = () => {
  return (
    <div className="app">
      <NightSky3D />
      <header className="overlay">
        <div className="content">
          <p className="eyebrow">3D Experience</p>
          <h1>
            Deep&apos;s <span>Cosmic Portfolio</span>
          </h1>
          <p className="tagline">
            3D starfield view
          </p>
        </div>
      </header>
    </div>
  )
}

export default NightSky3DPage

