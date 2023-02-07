import { useState } from 'react'
import logoUrl, { ReactComponent as Logo } from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  console.log(logoUrl, Logo);

  return (
    <div className="App">
      <Logo />
    </div>
  )
}

export default App
