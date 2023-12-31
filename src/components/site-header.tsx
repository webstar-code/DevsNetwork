import { useLocation } from "react-router-dom";
import { Logo } from "../assets";
import { IcLogout } from "../assets/icons";
import { useAppDispatach, useAppSelector } from "../hooks/useRedux";
import { logout } from "../reducer/auth";

export function SiteHeader() {
  const { user } = useAppSelector(state => state.userSlice);
  const dispatch = useAppDispatach();
  const location = useLocation();

  function onLogout() {
    dispatch(logout());
  }

  if (location.pathname.startsWith("/network")) {
    return null
  }
  if (location.pathname.startsWith("/login")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} className="w-6 h-6" />
          <h1 className="text-base text-primary-foreground font-semibold">DevsNetwork</h1>
        </div>
        {user &&
          <div className="flex gap-6 items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-secondary/50">
              <img src={user?.photoUrl} className="w-full h-full object-cover" />
            </div>
            <img onClick={() => onLogout()} src={IcLogout} className="w-5 h-5 cursor-pointer" />
          </div>
        }
      </div>
    </header>
  )
}