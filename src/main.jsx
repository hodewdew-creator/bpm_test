import React from 'react'
import ReactDOM from 'react-dom/client'
import BpmCounterApp from './bpm_counter_app'
import './index.css'

// iOS Safari vh 보정: --vh 변수 세팅
function setVH() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
setVH()
window.addEventListener('resize', setVH)
window.addEventListener('orientationchange', setVH)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BpmCounterApp />
  </React.StrictMode>
)
