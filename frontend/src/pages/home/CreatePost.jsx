import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp, IoSend } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiFetch } from "../../utils/apiFetch";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await apiFetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Bir şeyler yanlış gitti");
				}
				return data;
			} catch (error) {
				if (error instanceof Error) throw error;
				throw new Error(String(error));
			}
		},

		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Gönderi oluşturuldu");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const canSubmit = Boolean(text.trim() || img);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!canSubmit) {
			toast.error("Metin yazın veya bir görsel seçin");
			return;
		}
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-3 sm:p-3 items-start gap-3 border-b border-gray-700'>
			<div className='avatar shrink-0'>
				<div className='w-8 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt='' />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full min-w-0' onSubmit={handleSubmit}>
				<label className='sr-only' htmlFor='create-post-text'>
					Gönderi metni
				</label>
				{/* z-index + arka plan: temada metin rengi ezilmesini ve üst üste binmeyi önler */}
				<div className='relative z-20 w-full rounded-md border border-zinc-500/45 bg-zinc-600/45 p-1.5 shadow-sm'>
					<textarea
						id='create-post-text'
						name='createPostText'
						rows={3}
						autoComplete='off'
						spellCheck={true}
						className='block w-full min-h-[4.5rem] resize-y rounded border-0 bg-transparent px-2 py-1.5 text-sm leading-relaxed text-zinc-100 caret-sky-400 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-400/35'
						placeholder='Neler oluyor?'
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</div>
				<p className='text-[11px] leading-snug text-zinc-500'>Paylaşmak için metin yazın veya görsel ekleyin.</p>
				{img && (
					<div className='relative w-full max-w-sm'>
						<IoCloseSharp
							className='absolute top-1 right-1 z-10 text-white bg-gray-800 rounded-full w-6 h-6 cursor-pointer p-0.5'
							onClick={() => {
								setImg(null);
								if (imgRef.current) imgRef.current.value = "";
							}}
							aria-label='Görseli kaldır'
						/>
						<img src={img} className='w-full max-h-72 object-contain rounded-lg border border-gray-700' alt='' />
					</div>
				)}

				<div className='flex flex-col gap-2 pt-2 border-t border-gray-700/90 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex flex-wrap items-center gap-2 min-w-0'>
						<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
						<button
							type='button'
							className='btn-web-secondary normal-case'
							onClick={() => imgRef.current?.click()}
							title='Bilgisayarınızdan görsel seçin'
						>
							<CiImageOn className='w-4 h-4' />
							Görsel ekle
						</button>
						<button
							type='button'
							className='btn-web-icon'
							disabled
							title='Emoji seçici yakında'
							aria-disabled='true'
						>
							<BsEmojiSmileFill className='w-3.5 h-3.5' />
						</button>
					</div>
					<div className='flex w-full justify-end sm:w-auto sm:shrink-0'>
						<button type='submit' disabled={isPending} title='Gönderiyi paylaş' className='btn-web-primary'>
							{isPending ? (
								<>
									<span className='loading loading-spinner loading-sm text-white' />
									<span>Gönderiliyor</span>
								</>
							) : (
								<>
									<IoSend className='h-4 w-4 shrink-0 opacity-95' aria-hidden />
									<span>Gönder</span>
								</>
							)}
						</button>
					</div>
				</div>
				{isError && <div className='text-red-500 text-sm'>{error.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;
