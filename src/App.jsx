import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Moon,
  MousePointer2,
  Pause,
  Play,
  Rotate3D,
  Sparkles,
  Sun,
} from 'lucide-react'
import CarScene from './components/CarScene'
import { cameraViews, cars, styleModes } from './data/cars'

function IconButton({ label, children, active = false, onClick }) {
  return (
    <button
      className={`icon-button ${active ? 'is-active' : ''}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Spec({ label, value }) {
  return (
    <div className="spec-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default function App() {
  const [carIndex, setCarIndex] = useState(0)
  const [mode, setMode] = useState('toon')
  const [colorIndex, setColorIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [view, setView] = useState('hero')
  const [night, setNight] = useState(true)
  const car = cars[carIndex]
  const style = useMemo(() => styleModes.find((item) => item.id === mode), [mode])

  const changeCar = useCallback((direction) => {
    setCarIndex((current) => (current + direction + cars.length) % cars.length)
    setColorIndex(0)
    setView('hero')
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') changeCar(-1)
      if (event.key === 'ArrowRight') changeCar(1)
      if (event.code === 'Space') {
        event.preventDefault()
        setAutoRotate((current) => !current)
      }
      if (event.key.toLowerCase() === 'n') setNight((current) => !current)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [changeCar])

  return (
    <main className={`app-shell mode-${mode} ${night ? 'is-night' : 'is-day'}`} style={{ '--accent': car.accent }}>
      <section className="scene-layer" aria-label={`${car.name} 三维展示`}>
        <CarScene
          car={car}
          mode={mode}
          colorIndex={colorIndex}
          autoRotate={autoRotate}
          view={view}
          night={night}
        />
      </section>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="CarDemo 首页">
          <span className="brand-mark"><Rotate3D size={20} /></span>
          <span>
            <strong>CARDEMO</strong>
            <small>3D AUTOMOTIVE LAB</small>
          </span>
        </a>

        <div className="topbar-status">
          <span className="live-dot" />
          WEBGL LIVE
        </div>

        <div className="topbar-actions">
          <IconButton label={night ? '切换日间灯光' : '切换夜间灯光'} onClick={() => setNight((current) => !current)}>
            {night ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <IconButton label={autoRotate ? '暂停自动旋转' : '开始自动旋转'} active={autoRotate} onClick={() => setAutoRotate((current) => !current)}>
            {autoRotate ? <Pause size={17} /> : <Play size={17} />}
          </IconButton>
        </div>
      </header>

      <aside className="vehicle-panel glass-panel">
        <div className="eyebrow-row">
          <span>{String(carIndex + 1).padStart(2, '0')} / {String(cars.length).padStart(2, '0')}</span>
          <span>{style.short} RENDER</span>
        </div>
        <p className="vehicle-kicker">{car.category}</p>
        <h1>{car.name}</h1>
        <h2>{car.zhName}</h2>
        <p className="vehicle-description">{car.description}</p>

        <div className="spec-grid">
          <Spec label="最大功率" value={car.stats.power} />
          <Spec label="最高时速" value={car.stats.speed} />
          <Spec label="驱动形式" value={car.stats.drive} />
          <Spec label="整备质量" value={car.stats.mass} />
        </div>

        <div className="paint-section">
          <div className="section-label">
            <span>车漆方案</span>
            <span>{String(colorIndex + 1).padStart(2, '0')}</span>
          </div>
          <div className="swatches">
            {car.colors.map((color, index) => (
              <button
                key={color}
                type="button"
                className={`swatch ${colorIndex === index ? 'is-selected' : ''}`}
                style={{ '--swatch': color }}
                aria-label={`选择车漆 ${index + 1}`}
                onClick={() => setColorIndex(index)}
              />
            ))}
          </div>
        </div>
      </aside>

      <aside className="control-stack glass-panel" aria-label="场景控制">
        <div className="control-heading">
          <Camera size={16} />
          <span>CAMERA</span>
        </div>
        {Object.entries(cameraViews).map(([key, item]) => (
          <button
            key={key}
            className={`view-button ${view === key ? 'is-active' : ''}`}
            type="button"
            onClick={() => setView(key)}
          >
            <span>{item.label}</span>
            <span>{key.toUpperCase()}</span>
          </button>
        ))}
        <div className="mouse-hint"><MousePointer2 size={14} /> 拖拽旋转 · 滚轮缩放</div>
      </aside>

      <section className="style-switcher glass-panel" aria-label="视觉风格">
        <div className="style-title"><Sparkles size={15} /> VISUAL STYLE</div>
        <div className="segmented-control">
          {styleModes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? 'is-active' : ''}
              onClick={() => setMode(item.id)}
            >
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      </section>

      <nav className="vehicle-dock glass-panel" aria-label="车型选择">
        <button className="dock-arrow" type="button" onClick={() => changeCar(-1)} aria-label="上一辆车">
          <ChevronLeft size={20} />
        </button>
        <div className="vehicle-list">
          {cars.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`vehicle-card ${index === carIndex ? 'is-active' : ''}`}
              onClick={() => {
                setCarIndex(index)
                setColorIndex(0)
                setView('hero')
              }}
            >
              <span className="vehicle-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="mini-silhouette" data-type={item.type}>
                <i style={{ background: item.colors[0] }} />
              </span>
              <span className="vehicle-card-copy">
                <strong>{item.name}</strong>
                <small>{item.zhName}</small>
              </span>
            </button>
          ))}
        </div>
        <button className="dock-arrow" type="button" onClick={() => changeCar(1)} aria-label="下一辆车">
          <ChevronRight size={20} />
        </button>
      </nav>

      <div className="shortcut-hint">
        <span>← → 切换车型</span>
        <span>SPACE 旋转</span>
        <span>N 灯光</span>
      </div>
    </main>
  )
}
