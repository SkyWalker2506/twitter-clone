import fs from "fs/promises";

import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG_ERROR_TR, isCloudinaryConfigured } from "../lib/isCloudinaryConfigured.js";
import {
	localFilePathFromUploadUrl,
	isLocalUploadUrl,
	saveDataUrlToUploads,
	useLocalImageUploads,
} from "../lib/saveDataUrlToUploads.js";

export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

		if (!text && !img) {
			return res.status(400).json({ error: "Gönderide metin veya görsel olmalı" });
		}

		if (img) {
			if (isCloudinaryConfigured()) {
				try {
					const uploadedResponse = await cloudinary.uploader.upload(img, {
						folder: "posts",
						resource_type: "image",
					});
					img = uploadedResponse.secure_url;
				} catch (cloudErr) {
					console.error("Cloudinary gönderi görseli:", cloudErr);
					if (useLocalImageUploads()) {
						img = await saveDataUrlToUploads(img, "posts");
					} else {
						throw cloudErr;
					}
				}
			} else if (useLocalImageUploads()) {
				img = await saveDataUrlToUploads(img, "posts");
			} else {
				return res.status(503).json({ error: CLOUDINARY_CONFIG_ERROR_TR });
			}
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		console.error("Error in createPost controller:", error);
		const localMsg = error?.message;
		if (typeof localMsg === "string" && (localMsg.includes("Geçersiz") || localMsg.includes("çok büyük") || localMsg.includes("Boş görsel"))) {
			return res.status(400).json({ error: localMsg });
		}
		const apiMsg = error?.error?.message || error?.message || "";
		if (typeof apiMsg === "string") {
			if (/invalid api|api_key|api secret|authentication/i.test(apiMsg)) {
				return res.status(503).json({
					error: "Cloudinary kimlik bilgileri geçersiz veya eksik. .env içindeki anahtarları kontrol edin.",
				});
			}
		}
		if (error?.http_code === 401) {
			return res.status(503).json({
				error: "Cloudinary kimlik doğrulaması başarısız; API anahtarlarını kontrol edin.",
			});
		}
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Gönderi bulunamadı" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Bu gönderiyi silme yetkiniz yok" });
		}

		if (post.img) {
			if (isLocalUploadUrl(post.img)) {
				const fp = localFilePathFromUploadUrl(post.img);
				if (fp) await fs.unlink(fp).catch(() => {});
			} else if (isCloudinaryConfigured()) {
				const imgId = post.img.split("/").pop()?.split(".")[0];
				if (imgId) await cloudinary.uploader.destroy(imgId).catch(() => {});
			}
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Gönderi silindi" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Yorum metni gerekli" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Gönderi bulunamadı" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Gönderi bulunamadı" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Sunucu hatası" });
	}
};
