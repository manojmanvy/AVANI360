import asyncio
import logging
import smtplib
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate, make_msgid

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_email_content(to_email: str, otp: str, user_name: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(f"BookMyLand Security Code: {otp}", "utf-8")
    msg["From"] = formataddr((str(Header(settings.smtp_from_name, "utf-8")), settings.smtp_from_email))
    msg["To"] = to_email
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="bookmyland.in")
    msg["X-Mailer"] = "BookMyLand Mailer"
    msg["Precedence"] = "bulk"

    # Plain-text version (critical for spam filter pass)
    plain_text = f"""Hello {user_name},

We received a request to reset your password for your BookMyLand account.

Your 6-digit verification code is: {otp}

This code will expire in {settings.otp_expire_minutes} minutes.

If you did not request a password reset, you can safely ignore this email. Your account password will remain unchanged.

Best regards,
The BookMyLand Team
Greenyas Consultancy Services
Chengalpattu, Tamil Nadu - 603002
"""

    # High quality, spam-free HTML template
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f5f1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c261b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f5f1; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #dbe2da; box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #101e13; padding: 24px 32px; text-align: left;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="background-color: #1fa572; color: #ffffff; border-radius: 10px; width: 36px; height: 36px; text-align: center; line-height: 36px; font-weight: bold; font-size: 18px; display: inline-block;">
                      &#x1F33F;
                    </div>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">BookMy<span style="color: #43bf8b;">Land</span></span>
                    <div style="color: #cfdbcc; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Tamil Nadu</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #101e13; margin: 0 0 16px 0;">Password Reset Verification</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #435240; margin: 0 0 24px 0;">
                Hello <strong>{user_name}</strong>,<br><br>
                We received a request to reset your password. Use the verification code below to complete the reset. This code is valid for <strong>{settings.otp_expire_minutes} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background-color: #f4f7f3; border: 2px dashed #1fa572; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #546850; font-weight: 600; margin-bottom: 8px;">Your 6-Digit Code</div>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0d6f4d; font-family: 'Courier New', Courier, monospace;">
                  {otp}
                </div>
              </div>

              <p style="font-size: 13px; line-height: 1.5; color: #7f947d; margin: 0 0 20px 0;">
                If you did not request this code, you can safely ignore this email. No changes will be made to your account.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eef2ed; margin: 24px 0;">

              <p style="font-size: 11px; color: #8ca187; margin: 0; line-height: 1.5;">
                This is an automated security message from BookMyLand. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7f5ed; padding: 20px 32px; border-top: 1px solid #ede4d3; text-align: center; font-size: 11px; color: #7d6343;">
              <strong>Greenyas Consultancy Services</strong><br>
              PI No 124/55, Periyamaniyaka Street, Chengalpattu, Tamil Nadu - 603002<br>
              <a href="http://www.Greenyasdigitalads.com" style="color: #1fa572; text-decoration: none; font-weight: 600;">www.Greenyasdigitalads.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    part1 = MIMEText(plain_text, "plain", "utf-8")
    part2 = MIMEText(html_content, "html", "utf-8")
    msg.attach(part1)
    msg.attach(part2)
    return msg


def _send_smtp_sync(to_email: str, otp: str, user_name: str) -> bool:
    if not settings.smtp_user or not settings.smtp_password:
        logger.warning(
            "SMTP credentials not configured (smtp_user / smtp_password). "
            "OTP for %s is: %s",
            to_email,
            otp,
        )
        return False

    try:
        msg = _build_email_content(to_email, otp, user_name)
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from_email, [to_email], msg.as_string())
        logger.info("Successfully sent OTP email to %s", to_email)
        return True
    except Exception as exc:
        logger.error("Failed to send OTP email to %s: %s", to_email, exc)
        return False


async def send_otp_email(to_email: str, otp: str, user_name: str = "User") -> bool:
    """Sends OTP email asynchronously using threadpool executor."""
    return await asyncio.to_thread(_send_smtp_sync, to_email, otp, user_name)
