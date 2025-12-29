// HTML template for welcome email
export function getWelcomeEmailHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Sad Sunday Club</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf0eb; color: #6b4e4d;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf0eb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0 0 20px 0; font-family: 'Lora', serif; font-size: 28px; font-weight: 400; color: #6b4e4d;">
                Welcome to Sad Sunday Club
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #6b4e4d;">
                Thank you for joining.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #6b4e4d;">
                We're not here to fix you. We're here to remind you that feeling is not a flaw.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #6b4e4d;">
                You'll receive quiet things from time to time — small letters, drawings, thoughts, or gentle reminders that you're doing okay.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #6b4e4d;">
                Welcome to the club.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid #f5d4c9;">
              <p style="margin: 0; font-size: 14px; color: #8b6f6e;">
                Sad Sunday Club — made by a human, for humans.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
