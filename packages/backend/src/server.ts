import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/ok", async (req: Request, res: Response) => {
  res.status(200).send("ok");
});

app.post("/verify", async (req, res) => {
  const {
    nullifier_hash,
    proof,
    merkle_root,
    verification_level,
    action,
    signal_hash,
  } = req.body;

  const app_id = process.env.APP_ID;

  try {
    const response = await axios.post(
      `https://developer.worldcoin.org/api/v2/verify/${app_id}`,
      {
        nullifier_hash,
        proof,
        merkle_root,
        verification_level,
        action,
        signal_hash,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "YourAppName/1.0",
        },
      }
    );

    if (response.status === 200) {
      res.json({ success: true, message: "Verification successful" });
    }
  } catch (error: any) {
    if (error.response) {
      res
        .status(error.response.status)
        .json({ success: false, message: error.response.data });
    } else {
      res.status(500).json({
        success: false,
        message: "An error occurred during verification",
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
