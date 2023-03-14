import mongoose, { ConnectOptions } from "mongoose";
import config from "../config";

export default (): void => {
  mongoose.set("strictQuery", true);

  mongoose.connect(config.DATABASE.URL, <ConnectOptions>{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () =>
    console.log("Connected to MongoDB", { service: "MongoDB" })
  );

  mongoose.connection.on("error", (error: Error) =>
    console.error(`Connection failed: ${error}`, { service: "MongoDB" })
  );
};
