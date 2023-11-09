import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = config().parsed.MONGODB_URI;
mongoose
.connect(url)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600
};


app.options('/register', cors(issue2options));

app.post("/register", cors(issue2options), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.send(true);
  } catch (err) {
    console.log(err);
    res.send(false);
  }
});

app.post("/login", cors(), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.send(false);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
