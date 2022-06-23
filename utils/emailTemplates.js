/**
 * @description - Email template to send OTP.
 * @param {String} otp - The one time password. 
 * @returns {String} - The email template.
 */
module.exports.emailOtpTemplate = otp => {
    return `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">HackerSpace</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Your one time password(OTP).</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
            <p style="font-size:0.9em;">Regards,<br />HackerSpace</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>HackerSpace</p>
                <p>Varanasi</p>
                <p>Uttar Pradesh</p>
            </div>
            </div>
        </div>
    `;
}

/**
 * @description - Email template to send notifications to the user.
 * @param {String} name - The name of the user.
 * @param {String} message - The message to be sent.
 * @returns {String} - The email template.
 */
module.exports.emailNotificationTemplate = (name, message) => {
    return `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">HackerSpace</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Hello ${name} </p>
            <p>${message}</p>
            <p style="font-size:0.9em;">Regards,<br />HackerSpace</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>HackerSpace</p>
                <p>Varanasi</p>
                <p>Uttar Pradesh</p>
            </div>
            </div>
        </div>
    `;
}