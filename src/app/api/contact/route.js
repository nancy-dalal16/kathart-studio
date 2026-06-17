import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { name, email, company, message, recaptchaToken } = await request.json();

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return Response.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return Response.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Server-side validation
    const errors = [];

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("Name is required");
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Invalid email format");
    }

    if (errors.length > 0) {
      return Response.json({ error: errors.join(", ") }, { status: 400 });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_FROM_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6A53FF;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(company)}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from your website's contact form.
          </p>
        </div>
      `,
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "We received your inquiry - Kathart Studios",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6A53FF;">Thank You for Reaching Out!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>We've received your inquiry and appreciate you contacting Kathart Studios. Our team will review your message and get back to you shortly.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(message)}</p>
          </div>
          <p>Best regards,<br><strong>Kathart Studios Team</strong></p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return Response.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email error:", error.message);
    return Response.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
