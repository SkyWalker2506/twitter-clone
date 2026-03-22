import mongoose from "mongoose";

let memoryServer;

const connectMongoDB = async () => {
	try {
		let uri = process.env.MONGO_URI;
		if (process.env.USE_MEMORY_MONGO === "1" || uri === "memory") {
			const { MongoMemoryServer } = await import("mongodb-memory-server");
			memoryServer = await MongoMemoryServer.create();
			uri = memoryServer.getUri();
		}
		const conn = await mongoose.connect(uri);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
	}
};

export default connectMongoDB;
