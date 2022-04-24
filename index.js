const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

/// IMPORT ROUTES ///
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const friendRequestRoute = require("./routes/friendRequests");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

dotenv.config();

/// Connect to db only if not in test mode ///
if (!process.env.TEST) {
  mongoose.connect(process.env.MONGO_URI, () => {
    console.log("Connected to MongoDB");
  });
}

/// MIDDLEWARE ///
app.use(express.json({ limit: "10mb" }));
// app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "cloudflare-ipfs.com", "res.cloudinary.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

/// SETUP ROUTES ///
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/users", friendRequestRoute);
app.use("/api/posts", postRoute);
app.use("/api/posts", commentRoute);

/// Display React app ///
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

if (!process.env.TEST) {
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}

module.exports = app;
