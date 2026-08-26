import { lazy } from "react"

const SignIn = lazy(() => import("./pages/signs/SignIn"))

function App() {
  return (
    <SignIn/>
  )  
}

export default App
