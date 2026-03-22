import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Hesap oluşturulamadı");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Hesap başarıyla oluşturuldu");

			{
				/* Added this line below, after recording the video. I forgot to add this while recording, sorry, thx. */
			}
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
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
				<form className='w-full flex gap-3 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-16 lg:hidden fill-white mx-auto' />
					<h1 className='text-2xl sm:text-3xl font-bold text-white tracking-tight'>Bugün katılın.</h1>
					<label className='flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2 shadow-sm'>
						<MdOutlineMail className='h-4 w-4 shrink-0 text-zinc-600' />
						<input
							type='email'
							className='grow bg-transparent text-sm text-zinc-900 caret-zinc-900 placeholder:text-zinc-500 outline-none'
							placeholder='E-posta'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
							autoComplete='email'
						/>
					</label>
					<div className='flex gap-2 flex-wrap'>
						<label className='flex h-10 min-w-[140px] flex-1 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2 shadow-sm'>
							<FaUser className='h-3.5 w-3.5 shrink-0 text-zinc-600' />
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
						<label className='flex h-10 min-w-[140px] flex-1 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2 shadow-sm'>
							<MdDriveFileRenameOutline className='h-3.5 w-3.5 shrink-0 text-zinc-600' />
							<input
								type='text'
								className='grow bg-transparent text-sm text-zinc-900 caret-zinc-900 placeholder:text-zinc-500 outline-none'
								placeholder='Ad soyad'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
								autoComplete='name'
							/>
						</label>
					</div>
					<label className='flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2 shadow-sm'>
						<MdPassword className='h-4 w-4 shrink-0 text-zinc-600' />
						<input
							type='password'
							className='grow bg-transparent text-sm text-zinc-900 caret-zinc-900 placeholder:text-zinc-500 outline-none'
							placeholder='Şifre'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
							autoComplete='new-password'
						/>
					</label>
					<button type='submit' className='btn-web-primary w-full justify-center mt-1'>
						{isPending ? "Yükleniyor..." : "Kayıt ol"}
					</button>
					{isError && <p className='text-red-400 text-sm'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-6 w-full'>
					<p className='text-zinc-400 text-sm'>Zaten hesabınız var mı?</p>
					<Link to='/login' className='w-full'>
						<button type='button' className='btn-web-outline w-full justify-center'>
							Giriş yap
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
