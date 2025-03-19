import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:`nivethikashivakumar56@gmail.com`,
    pass: `xnep zczr wocb dtxf`,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: `nivethikashivakumar56@gmail.com`,
    to,
    subject,
    text,
  });
};

export default sendEmail;