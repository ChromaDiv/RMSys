import { Resend } from 'resend';

let resend;

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ RESEND_API_KEY is missing. Email features will use console fallback.");
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  console.log(`Attempting to send verification email to ${email} via Resend...`);

  const client = getResend();

  try {
    if (!client) {
      throw new Error("Resend client not initialized (missing API key)");
    }

    const { data, error } = await client.emails.send({
      from: `RMSys <${fromEmail}>`,
      to: [email],
      subject: 'Verify your RMSys account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Welcome to RMSys, ${name}!</h2>
          <p style="color: #374151; line-height: 1.5;">Please verify your email address to get started with your enterprise dashboard.</p>
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
              Verify Email Address
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">If you did not create an account, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">© 2026 RMSys Inc. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      throw new Error(error.message);
    }

    console.log('Resend Success:', data.id);
    return data;
  } catch (err) {
    console.error('Fatal Mail Error:', err);
    // Fallback to console log during onboarding if send fails
    console.log('--- EMAIL FALLBACK (CHECK LINK BELOW) ---');
    console.log(`Verify URL: ${verifyUrl}`);
    console.log('-----------------------------------------');
    throw err;
  }
}
