import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { apiFetch } from "./utils/apiFetch";

/** Geliştirmede oturum yoksa Admin ile otomatik giriş (test). Kapatmak: VITE_DEV_AUTO_LOGIN=false */
const shouldDevAutoLogin =
	import.meta.env.DEV && import.meta.env.VITE_DEV_AUTO_LOGIN !== "false";

function App() {
	const [devBootstrapped, setDevBootstrapped] = useState(!shouldDevAutoLogin);

	useEffect(() => {
		if (!shouldDevAutoLogin) return;
		let cancelled = false;
		(async () => {
			try {
				const me = await apiFetch("/api/auth/me");
				const meData = await me.json();
				if (me.ok && !meData?.error) return;
				await apiFetch("/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						username: import.meta.env.VITE_DEV_LOGIN_USER ?? "Admin",
						password: import.meta.env.VITE_DEV_LOGIN_PASSWORD ?? "1234",
					}),
				});
			} catch (e) {
				console.warn("Dev otomatik giriş başarısız:", e);
			} finally {
				if (!cancelled) setDevBootstrapped(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await apiFetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Bir şeyler yanlış gitti");
				}
				return data;
			} catch (error) {
				if (error instanceof Error) throw error;
				throw new Error(String(error));
			}
		},
		retry: false,
		enabled: devBootstrapped,
	});

	if (!devBootstrapped || isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-6'>
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;
