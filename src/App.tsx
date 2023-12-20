import { GITUHB } from "./assets"

function App() {
  return (
    <div className="w-full min-h-screen bg-primary flex flex-col items-center justify-center gap-10">
      <h1 className='text-secondary text-7xl font-bold'>DEVsNetwork</h1>
      <p className='text-base text-secondary'>Start creating your network by logging in below</p>
      <div className="w-full max-w-[320px] h-10 bg-primary border rounded-md flex items-center justify-center cursor-pointer">
        <p className="text-base text-primary-foreground mr-2">Login with GitHub</p>
        <img src={GITUHB} className="w-6 h-5" />
      </div>
    </div>
  )
}

export default App
