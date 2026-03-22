import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../../utils/apiFetch";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await apiFetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Bir şeyler yanlış gitti");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-6xl mx-auto flex min-h-screen px-4'>
			<div className='flex-1 hidden lg:flex items-center justify-center p-8'>
				<XSvg className='lg:max-w-md w-full fill-white opacity-90' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center py-8 w-full max-w-md mx-auto'>
				<form className='flex gap-3 flex-col w-full' onSubmit={handleSubmit}>
					<XSvg className='w-16 lg:hidden fill-white mx-auto' />
					<h1 className='text-2xl sm:text-3xl font-bold text-white tracking-tight'>Hadi başlayalım.</h1>
					<label className='flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2 shadow-sm'>
						<MdOutlineMail className='h-4 w-4 shrink-0 text-zinc-600' />
						<input
							type='text'
							className='grow bg-transparent text-sm text-zinc-900 caret-zinc-900 placeholder:text-zinc-500 outline-none'
							placeholder='Kullanıcı adı'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
							autoComplete='username'
						/>
					</label>

					<label className='flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2 shadow-sm'>
						<MdPassword className='h-4 w-4 shrink-0 text-zinc-600' />
						<input
							type='password'
							className='grow bg-transparent text-sm text-zinc-900 caret-zinc-900 placeholder:text-zinc-500 outline-none'
							placeholder='Şifre'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
							autoComplete='current-password'
						/>
					</label>
					<button type='submit' className='btn-web-primary w-full justify-center mt-1'>
						{isPending ? "Yükleniyor..." : "Giriş yap"}
					</button>
					{isError && <p className='text-red-400 text-sm'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-6 w-full'>
					<p className='text-zinc-400 text-sm'>Hesabınız yok mu?</p>
					<Link to='/signup' className='w-full'>
						<button type='button' className='btn-web-outline w-full justify-center'>
							Kayıt ol
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
