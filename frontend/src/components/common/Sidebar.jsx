import AppLogo from "../AppLogo";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiFetch } from "../../utils/apiFetch";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await apiFetch("/api/auth/logout", {
					method: "POST",
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
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Çıkış yapılamadı");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className='md:flex-[2_2_0] w-16 max-w-[13.5rem] shrink-0'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-16 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start px-1 py-1.5 md:px-0'>
					<AppLogo className='h-9 w-auto max-w-[10rem] hover:opacity-90 transition-opacity' />
				</Link>
				<ul className='flex flex-col gap-0.5 mt-3'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-2.5 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-1.5 pl-1.5 pr-3 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-5 h-5' />
							<span className='text-sm font-medium hidden md:block'>Ana sayfa</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-2.5 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-1.5 pl-1.5 pr-3 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-[1.35rem] h-[1.35rem]' />
							<span className='text-sm font-medium hidden md:block'>Bildirimler</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-2.5 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-1.5 pl-1.5 pr-3 max-w-fit cursor-pointer'
						>
							<FaUser className='w-[1.25rem] h-[1.25rem]' />
							<span className='text-sm font-medium hidden md:block'>Profil</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-6 flex gap-2 items-center transition-all duration-300 hover:bg-base-200 py-1.5 px-2 md:px-3 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-7 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1 min-w-0'>
							<div className='hidden md:block min-w-0'>
								<p className='text-white font-semibold text-xs w-full truncate'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-[11px]'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-4 h-4 shrink-0 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
