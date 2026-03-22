import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";
import { apiFetch } from "../../utils/apiFetch";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await apiFetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Bir şeyler yanlış gitti");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow, isPending } = useFollow();

	if (suggestedUsers?.length === 0) return <div className='lg:w-60 w-0 shrink-0'></div>;

	return (
		<div className='hidden lg:block my-3 mx-1 w-60 shrink-0'>
			<div className='bg-base-200 p-3 rounded-lg border border-base-300 sticky top-3'>
				<p className='font-semibold text-sm text-zinc-200'>Takip önerileri</p>
				<div className='flex flex-col gap-3 mt-2'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-7 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col min-w-0'>
										<span className='font-medium text-sm tracking-tight truncate w-24'>
											{user.fullName}
										</span>
										<span className='text-xs text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div className='shrink-0'>
									<button
										type='button'
										className='btn-web-light px-3 min-w-[4.5rem]'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Takip et"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
