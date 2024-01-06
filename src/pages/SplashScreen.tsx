import { IcLOADING } from "../assets/animated";

export function SplashScreen() {
  return <div className="w-full min-h-screen bg-primary flex flex-col items-center justify-center gap-10">
    <div className="min-w-[200px] flex flex-col items-center justify-center gap-6 bg-white p-6 rounded-md">
      <img src={IcLOADING} className="w-6 h-6" />
      <h3 className="text-base text-primary font-medium">Connecting...</h3>
    </div>
  </div>
}