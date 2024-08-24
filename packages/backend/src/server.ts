import express, { Request, Response } from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import { type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración del servidor
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());

// Ruta para manejar la verificación
app.post("/ok", async (req: Request, res: Response) => {
  res.status(200).send("ok");
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Ruta para manejar la verificación
app.post("/verify", async (req: Request, res: Response) => {
  const { proof, signal } = req.body;
  const app_id = process.env.APP_ID as `app_${string}`;
  const action = process.env.ACTION_ID as `app_${string}`;
  const verifyRes = (await verifyCloudProof(
    proof,
    app_id,
    action,
    signal
  )) as IVerifyResponse;

  console.log("vamo a ver", verifyRes);

  if (verifyRes.success) {
    // This is where you should perform backend actions if the verification succeeds
    // Such as, setting a user as "verified" in a database
    res.status(200).send(verifyRes);
  } else {
    // This is where you should handle errors from the World ID /verify endpoint.
    // Usually these errors are due to a user having already verified.
    res.status(400).send(verifyRes);
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
