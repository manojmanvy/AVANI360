import asyncio
import json
import logging
import smtplib
import urllib.error
import urllib.request
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate, make_msgid

from app.core.config import settings

logger = logging.getLogger(__name__)


def _get_email_texts(to_email: str, otp: str, user_name: str) -> tuple[str, str]:
    """Generates plain text and rich HTML email contents."""
    plain_text = f"""Hello {user_name},

We received a request to reset your password for your AVANI360 account.

Your 6-digit verification code is: {otp}

This code will expire in {settings.otp_expire_minutes} minutes.

If you did not request a password reset, you can safely ignore this email. Your account password will remain unchanged.

Best regards,
The AVANI360 Team
Greenyas Consultancy Services
Chengalpattu, Tamil Nadu - 603002
"""

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
                    <span style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">AVANI<span style="color: #43bf8b;">360</span></span>
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
                This is an automated security message from AVANI360. Please do not reply directly to this email.
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
    return plain_text, html_content


def _build_email_content(to_email: str, otp: str, user_name: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(f"AVANI360 Security Code: {otp}", "utf-8")
    msg["From"] = formataddr((str(Header(settings.smtp_from_name, "utf-8")), settings.smtp_from_email))
    msg["To"] = to_email
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="avani360.in")
    msg["X-Mailer"] = "AVANI360 Mailer"
    msg["Precedence"] = "bulk"

    plain_text, html_content = _get_email_texts(to_email, otp, user_name)
    part1 = MIMEText(plain_text, "plain", "utf-8")
    part2 = MIMEText(html_content, "html", "utf-8")
    msg.attach(part1)
    msg.attach(part2)
    return msg


def _send_brevo_http(to_email: str, otp: str, user_name: str) -> tuple[bool, str]:
    """Sends email via Brevo HTTPS REST API on port 443 (never blocked by cloud firewalls)."""
    api_key = (settings.brevo_api_key or "").strip()
    if not api_key:
        return False, "BREVO_API_KEY not configured"

    plain_text, html_content = _get_email_texts(to_email, otp, user_name)
    payload = {
        "sender": {
            "name": settings.smtp_from_name,
            "email": settings.smtp_from_email,
        },
        "to": [
            {"email": to_email, "name": user_name}
        ],
        "subject": f"AVANI360 Security Code: {otp}",
        "htmlContent": html_content,
        "textContent": plain_text,
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.brevo.com/v3/smtp/email",
        data=data,
        headers={
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json",
            "user-agent": "AVANI360/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode("utf-8")
            logger.info("Brevo email delivered to %s: %s", to_email, body)
            return True, "Email delivered via Brevo HTTPS API"
    except urllib.error.HTTPError as err:
        err_body = err.read().decode("utf-8", errors="ignore")
        logger.error("Brevo API error (%s): %s", err.code, err_body)
        return False, f"Brevo API error ({err.code}): {err_body}"
    except Exception as exc:
        logger.error("Brevo request failed: %s", exc)
        return False, f"Brevo request failed: {exc}"


def _send_resend_http(to_email: str, otp: str, user_name: str) -> tuple[bool, str]:
    """Sends email via Resend HTTPS REST API on port 443."""
    api_key = (settings.resend_api_key or "").strip()
    if not api_key:
        return False, "RESEND_API_KEY not configured"

    plain_text, html_content = _get_email_texts(to_email, otp, user_name)
    payload = {
        "from": f"{settings.smtp_from_name} <{settings.smtp_from_email}>",
        "to": [to_email],
        "subject": f"AVANI360 Security Code: {otp}",
        "html": html_content,
        "text": plain_text,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "AVANI360/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode("utf-8")
            logger.info("Resend email delivered to %s: %s", to_email, body)
            return True, "Email delivered via Resend HTTPS API"
    except urllib.error.HTTPError as err:
        err_body = err.read().decode("utf-8", errors="ignore")
        logger.error("Resend API error (%s): %s", err.code, err_body)
        return False, f"Resend API error ({err.code}): {err_body}"
    except Exception as exc:
        logger.error("Resend request failed: %s", exc)
        return False, f"Resend request failed: {exc}"


def _send_smtp_sync(to_email: str, otp: str, user_name: str) -> tuple[bool, str]:
    """Attempts Gmail SMTP via direct SSL port 465 or STARTTLS port 587."""
    user = (settings.smtp_user or "").strip()
    pwd = (settings.smtp_password or "").replace(" ", "").strip()
    if not user or not pwd:
        msg = "SMTP_USER or SMTP_PASSWORD not configured"
        logger.warning(msg)
        return False, msg

    msg = _build_email_content(to_email, otp, user_name)

    # Attempt 1: Port 465 SSL
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=12) as server:
            server.login(user, pwd)
            server.sendmail(settings.smtp_from_email, [to_email], msg.as_string())
        logger.info("Successfully sent OTP email via SSL 465 to %s", to_email)
        return True, "Email delivered via SSL 465"
    except Exception as ssl_err:
        logger.warning("Port 465 SSL failed (%s), attempting Port 587 STARTTLS...", ssl_err)

    # Attempt 2: Port 587 STARTTLS
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=12) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(user, pwd)
            server.sendmail(settings.smtp_from_email, [to_email], msg.as_string())
        logger.info("Successfully sent OTP email via STARTTLS 587 to %s", to_email)
        return True, "Email delivered via STARTTLS 587"
    except Exception as exc:
        err_msg = f"Gmail SMTP failed: {exc}"
        logger.error(err_msg)
        return False, err_msg


def _send_email_sync(to_email: str, otp: str, user_name: str) -> tuple[bool, str]:
    """Unified email dispatcher: prefers HTTPS REST API (Port 443) over raw SMTP sockets."""
    # 1. Brevo HTTPS API (Port 443 - 300 free emails/day, no card needed)
    if settings.brevo_api_key:
        ok, res = _send_brevo_http(to_email, otp, user_name)
        if ok:
            return ok, res
        logger.warning("Brevo API failed (%s), trying fallbacks...", res)

    # 2. Resend HTTPS API (Port 443)
    if settings.resend_api_key:
        ok, res = _send_resend_http(to_email, otp, user_name)
        if ok:
            return ok, res
        logger.warning("Resend API failed (%s), trying fallbacks...", res)

    # 3. Direct Gmail SMTP fallback
    return _send_smtp_sync(to_email, otp, user_name)


async def send_otp_email(to_email: str, otp: str, user_name: str = "User") -> tuple[bool, str]:
    """Sends OTP email asynchronously using threadpool executor."""
    return await asyncio.to_thread(_send_email_sync, to_email, otp, user_name)
