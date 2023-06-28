/** @format */

import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      res.status(422).json({ message: "Email inválido." });
      return;
    }

    let nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: "richardsobreiro@gmail.com",
        pass: "ttqdtdkbvxyhndmi",
      },
      secure: true,
    });

    const mailData = {
      from: email,
      to: "richardsobreiro@gmail.com",
      subject: `Subscrição a Newsletter ${email}`,
      text: email,
      html: `<h1>${email}</h1>`,
    };

    transporter.sendMail(mailData, function (err: any, info: any) {
      if (err) {
        console.log(err);
        res.json({ message: "Erro ao realizar a subscrição!", body: email });
      } else {
        res
          .status(201)
          .json({ message: "Subscrição realizada com sucesso!", body: email });
      }
    });
  }
}

export default handler;
