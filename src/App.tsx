import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { SiteHeader } from "./components/site-header";
import { auth } from "./firebase";
import { useAppDispatach, useAppSelector } from "./hooks/useRedux";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { MyNetworks } from "./pages/MyNetworks";
import { Network } from "./pages/Network";
import { SplashScreen } from "./pages/SplashScreen";
import { getUserById } from "./reducer/auth";
import { injectSpeedInsights } from '@vercel/speed-insights';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})
injectSpeedInsights({});

function App() {
  const dispatch = useAppDispatach();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await dispatch(getUserById(user.uid));
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SiteHeader />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthGuard />}>
              <Route index element={<MyNetworks />} />
              <Route path="/my-networks" element={<MyNetworks />} />
              <Route path="/network/:network_id" element={<Network />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export const AuthGuard = () => {
  const { user } = useAppSelector(state => state.userSlice);
  localStorage.setItem("last-location", window.location.pathname);
  if (!user) return <Navigate to="/login" state={{ from: window.location.href }} />
  return <Outlet />
}

export default App
