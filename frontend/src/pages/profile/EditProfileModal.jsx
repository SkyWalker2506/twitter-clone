import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdLink, MdLock, MdOutlineDescription, MdOutlineMail, MdPerson, MdTag } from "react-icons/md";

import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const fieldWrap =
	"flex min-h-10 items-start gap-2 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 shadow-sm";
const fieldInput =
	"grow min-h-[1.25rem] w-0 bg-transparent text-sm text-zinc-900 caret-zinc-900 placeholder:text-zinc-500 outline-none";
const fieldTextarea = `${fieldInput} min-h-[4rem] resize-y py-1 leading-relaxed`;

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const closeModal = () => {
		document.getElementById("edit_profile_modal")?.close();
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				type='button'
				className='btn-web-outline'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Profili düzenle
			</button>
			<dialog id='edit_profile_modal' className='modal modal-middle'>
				<div className='modal-box w-full max-w-lg border-0 bg-transparent p-0 shadow-none'>
					<div className='min-w-0 overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-xl'>
						{/* Üst bar — sağ panel kartlarıyla uyumlu */}
						<div className='flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3'>
							<div>
								<h3 className='text-sm font-semibold tracking-tight text-zinc-100'>Profili güncelle</h3>
								<p className='mt-0.5 text-xs text-zinc-500'>Bilgilerinizi kaydedin; şifre alanlarını yalnızca değiştirmek istediğinizde doldurun.</p>
							</div>
							<button
								type='button'
								className='btn-web-icon h-9 w-9 shrink-0'
								onClick={closeModal}
								aria-label='Kapat'
							>
								<IoClose className='h-5 w-5' aria-hidden />
							</button>
						</div>

						<form
							className='flex max-h-[min(70vh,32rem)] min-w-0 flex-col gap-3 overflow-y-auto overflow-x-hidden px-4 py-4'
							onSubmit={(e) => {
								e.preventDefault();
								updateProfile(formData);
							}}
						>
							<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
								<label className={fieldWrap}>
									<MdPerson className='mt-0.5 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
									<input
										type='text'
										placeholder='Ad soyad'
										className={fieldInput}
										value={formData.fullName}
										name='fullName'
										onChange={handleInputChange}
										autoComplete='name'
									/>
								</label>
								<label className={fieldWrap}>
									<MdTag className='mt-0.5 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
									<input
										type='text'
										placeholder='Kullanıcı adı'
										className={fieldInput}
										value={formData.username}
										name='username'
										onChange={handleInputChange}
										autoComplete='username'
									/>
								</label>
							</div>

							<label className={fieldWrap}>
								<MdOutlineMail className='mt-0.5 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
								<input
									type='email'
									placeholder='E-posta'
									className={fieldInput}
									value={formData.email}
									name='email'
									onChange={handleInputChange}
									autoComplete='email'
								/>
							</label>

							<label className={fieldWrap}>
								<MdOutlineDescription className='mt-1 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
								<textarea
									placeholder='Biyografi'
									className={fieldTextarea}
									value={formData.bio}
									name='bio'
									onChange={handleInputChange}
									rows={3}
								/>
							</label>

							<label className={fieldWrap}>
								<MdLink className='mt-0.5 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
								<input
									type='url'
									placeholder='Bağlantı (https://…)'
									className={fieldInput}
									value={formData.link}
									name='link'
									onChange={handleInputChange}
									autoComplete='url'
								/>
							</label>

							<div className='border-t border-base-300 pt-3'>
								<p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500'>Şifre</p>
								<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
									<label className={fieldWrap}>
										<MdLock className='mt-0.5 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
										<input
											type='password'
											placeholder='Mevcut şifre'
											className={fieldInput}
											value={formData.currentPassword}
											name='currentPassword'
											onChange={handleInputChange}
											autoComplete='current-password'
										/>
									</label>
									<label className={fieldWrap}>
										<MdLock className='mt-0.5 h-4 w-4 shrink-0 text-zinc-600' aria-hidden />
										<input
											type='password'
											placeholder='Yeni şifre'
											className={fieldInput}
											value={formData.newPassword}
											name='newPassword'
											onChange={handleInputChange}
											autoComplete='new-password'
										/>
									</label>
								</div>
							</div>

							<div className='flex w-full min-w-0 shrink-0 flex-col-reverse gap-2 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3'>
								<button
									type='button'
									className='btn-web-secondary w-full shrink-0 justify-center whitespace-nowrap sm:w-auto sm:min-w-[6.5rem]'
									onClick={closeModal}
								>
									İptal
								</button>
								<button
									type='submit'
									className='btn-web-primary w-full shrink-0 justify-center whitespace-nowrap sm:min-w-[8rem]'
									disabled={isUpdatingProfile}
								>
									{isUpdatingProfile ? "Güncelleniyor..." : "Güncelle"}
								</button>
							</div>
						</form>
					</div>
				</div>
				<form method='dialog' className='modal-backdrop bg-black/50 backdrop-blur-[1px]'>
					<button type='submit' className='absolute inset-0 h-full w-full cursor-default bg-transparent' aria-label='Pencereyi kapat' />
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
