import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] min-w-0 mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700 text-sm'>
					<div
						className={
							"flex justify-center flex-1 py-2.5 px-2 hover:bg-secondary/80 transition duration-300 cursor-pointer relative font-medium text-zinc-300"
						}
						onClick={() => setFeedType("forYou")}
					>
						Sizin için
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-9 h-0.5 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 py-2.5 px-2 hover:bg-secondary/80 transition duration-300 cursor-pointer relative font-medium text-zinc-300'
						onClick={() => setFeedType("following")}
					>
						Takip edilenler
						{feedType === "following" && (
							<div className='absolute bottom-0 w-9 h-0.5 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};
export default HomePage;
