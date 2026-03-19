import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export interface SimpleNewsItem {
  title: string;
  link: string;
  source: string;
}

export async function sendWelcomeEmail(email: string) {
  const resendKey = process.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;
  const from = 'AI Digest <postcards@contact.sumapetproject.co.in>';
  const subject = 'Welcome to Data Science and Data Analytics Digest';
  
  const html = `
    <div style="background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; padding: 40px; text-align: center;">
      <h1 style="color: #C87941; margin-bottom: 20px;">AI Digest</h1>
      <p style="font-size: 18px; margin-bottom: 30px;">Welcome to the signal.</p>
      <p style="margin-bottom: 40px;">You are now subscribed to the <strong>Data Science and Data Analytics Digest</strong>. Expect the latest intelligence in your inbox every morning at 9 AM.</p>
      <div style="border-top: 1px solid #333; padding-top: 20px; font-size: 12px; color: #888;">
        <p>If you didn't mean to sign up, <a href="https://contact.sumapetproject.co.in/api/unsubscribe?email=${email}" style="color: #C87941;">unsubscribe here</a>.</p>
      </div>
    </div>
  `;

  if (resend) {
    await resend.emails.send({ from, to: email, subject, html });
  } else {
    // Fallback to SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' }
    });
    await transporter.sendMail({ from, to: email, subject, html });
  }
}

export async function sendNewsletter(subscribers: string[], news: SimpleNewsItem[]) {
  const resendKey = process.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;
  const from = 'AI Digest <postcards@contact.sumapetproject.co.in>';
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const newsHtml = news.map(item => `
    <div style="margin-bottom: 25px; border-left: 4px solid #C87941; padding: 10px 20px; background: #000000;">
      <h3 style="margin: 0 0 5px 0;">
        <a href="${item.link}" style="color: #ffffff; text-decoration: none; font-size: 18px;">${item.title}</a>
      </h3>
      <p style="color: #C87941; font-size: 12px; margin: 0; text-transform: uppercase; font-weight: bold;">${item.source}</p>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #C87941; font-size: 32px; letter-spacing: -1px; margin: 0;">AI Digest</h1>
            <p style="color: #888; font-size: 14px; margin: 5px 0 0 0;">${date} • Pure Signal</p>
          </div>
          
          <div style="background: #000000;">
            ${newsHtml}
          </div>
          
          <div style="margin-top: 50px; text-align: center; border-top: 1px solid #333; padding-top: 30px;">
            <p style="color: #666; font-size: 12px;">Data Science and Data Analytics Digest</p>
            <p style="font-size: 11px; color: #444;">
              <a href="https://contact.sumapetproject.co.in/api/unsubscribe" style="color: #666;">Unsubscribe</a> • 
              <a href="https://contact.sumapetproject.co.in" style="color: #666;">View in Browser</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (resend) {
    await resend.emails.send({
      from,
      to: from, // Send to self
      bcc: subscribers, // Hide mailing list in BCC
      subject: `AI Digest: ${date}`,
      html: html,
    });
  } else {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' }
    });
    
    await transporter.sendMail({
      from,
      to: from, // Send to self
      bcc: subscribers, // Hide mailing list in BCC
      subject: `AI Digest: ${date}`,
    });
  }
}

export async function sendSubscribersList(adminEmail: string, subscribers: string[]) {
  const resendKey = process.env.RESEND_API_KEY;
  const resend = resendKey ? new Resend(resendKey) : null;
  const from = 'AI Digest Admin <postcards@contact.sumapetproject.co.in>';
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const html = `
    <div style="background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; padding: 40px;">
      <h1 style="color: #C87941; margin-bottom: 20px;">Nightly Subscriber Report</h1>
      <p style="font-size: 16px;">Date: ${date}</p>
      <p>Total Subscribers: <strong>${subscribers.length}</strong></p>
      <div style="margin-top: 20px; background: #111; padding: 20px; border: 1px solid #333;">
        <ul style="list-style: none; padding: 0;">
          ${subscribers.map(email => `<li style="margin-bottom: 5px; color: #ccc;">${email}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  const mailOptions = {
    from,
    to: adminEmail,
    subject: `[AI Digest] Subscriber List - ${date}`,
    html: html
  };

  if (resend) {
    await resend.emails.send(mailOptions);
  } else {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: { user: process.env.SMTP_USER || '', pass: process.env.SMTP_PASS || '' }
    });
    await transporter.sendMail(mailOptions);
  }
}
