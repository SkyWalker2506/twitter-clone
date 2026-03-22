import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

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
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-lg border-gray-700 shadow-md max-w-lg p-4'>
					<h3 className='font-semibold text-base my-2'>Profili güncelle</h3>
					<form
						className='flex flex-col gap-3'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Ad soyad'
								className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Kullanıcı adı'
								className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='E-posta'
								className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Biyografi'
								className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Mevcut şifre'
								className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Yeni şifre'
								className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Bağlantı'
							className='flex-1 input input-sm border border-gray-700 rounded-md px-2 py-1.5 text-sm'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button type='submit' className='btn-web-primary w-full sm:w-auto self-end'>
							{isUpdatingProfile ? "Güncelleniyor..." : "Güncelle"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>kapat</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
