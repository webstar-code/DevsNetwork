import { useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux"

export function SiteHeader() {
  const { user } = useAppSelector(state => state.userSlice);
  const location = useLocation();
  
  if (location.pathname.startsWith("/network")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container flex h-14 items-center justify-between">
        <h1 className="text-base text-primary-foreground font-semibold">DevsNetwork</h1>
        {user &&
          <div className="flex gap-10">
            <h3 className="text-sm text-primary-foreground">Networks I'm In</h3>
            <h3 className="text-sm text-primary-foreground">My Networks</h3>
            <div className="w-6 h-6 rounded-full overflow-hidden border border-secondary/50">
              <img src={user?.photoUrl} className="w-full h-full object-cover" />
            </div>
          </div>
        }
      </div>
    </header>
  )
}