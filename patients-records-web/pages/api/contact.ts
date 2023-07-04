/** @format */

import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, name, message } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      message.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }

    const newMessage = {
      email,
      name,
      message,
    };

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
      from: newMessage.email,
      to: "richardsobreiro@gmail.com",
      subject: `Message From: Name = ${newMessage.name} | Email = ${newMessage.email}`,
      text: newMessage.message,
      html: `<div><h1>Email: ${newMessage.email}</h1></div><div><h3>Name: ${newMessage.name}</h3></div><div>Message: ${newMessage.message}</div>`,
    };

    transporter.sendMail(mailData, function (err: any, info: any) {
      if (err) {
        console.log(err);
        res.json({ message: "Erro ao enviar a mensagem!", body: newMessage });
      } else {
        res
          .status(201)
          .json({ message: "Mensagem enviada!", body: newMessage });
      }
    });
  }
}

export default handler;
