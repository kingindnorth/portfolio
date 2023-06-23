const express = require("express")

require("dotenv").config()
const nodemailer = require("nodemailer")
const fs = require("fs")

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  }); 

app.use("/submit", sendEmail)
app.use("/download", downloadResume)

//Function to download the resume
async function downloadResume(req,res) {
    //path to the pdf file on the server
    const filePath = "./utils/testfile.pdf"
    //check if the file exists
    fs.access(filePath, fs.constants.R_OK, (err)=>{
        if(err){
            res.status(400).send("file not found")
            return 
        }
        //set appropriate headers for pdf download
        res.setHeader('Content-disposition', 'attachment; filename=file.pdf');
        res.setHeader('Content-type', 'application/pdf');

        // Read the file and stream it to the response
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
        console.log("file downloaded")
    })
}

// Function to send the email
async function sendEmail(req,res) {
  const {firstName, lastName, email, subject, text} = req.body
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USERNAME,
    subject: subject,
    text: JSON.stringify(text),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    //send mail to sender that response recorded.
    const info2 = await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject:"THANKYOU FOR REACHING OUT!",
        text: `Dear ${firstName} ${lastName},

        I wanted to take a moment to express my sincere gratitude for reaching out to me. Your message has truly brightened my day, and I appreciate your time and effort in connecting with me.
        
        Your interest, questions, or feedback mean a great deal to me as they help me grow and improve. I am grateful for the opportunity to engage with you and learn more about your experiences and expectations.
        
        Please know that your inquiry is important to me, and I am committed to addressing it promptly and thoroughly. I am already working diligently to provide you with the assistance or information you require. Your trust in me is valued, and I aim to exceed your expectations.
        
        Once again, thank you for reaching out to me. I value your support and look forward to serving you in the best possible manner. If there's anything else I can assist you with, please don't hesitate to let me know.
        
        Warmest regards,
        
        Prajjawal Tiwari`

    })
    console.log("email sent to user ", info2.response)
    res.redirect("/")
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

app.use(express.static("public"))

app.listen(PORT,()=>{
    console.log("server started");
    console.log(`site: http://localhost:${PORT}/`);
})