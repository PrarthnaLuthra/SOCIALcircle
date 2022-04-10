const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// const accessLogStream = rfs('access.log', {
//     interval: '1d',
//     path: logDirectory
// });
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});



const development = {
  name: "development",
  asset_path: "/assets",
  session_cookie_key: "blahsomething",
  db: "chatterbox_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "socialcircleconnectingpeople",
      pass: "cyzsxrtobzogewzc",
    },
  },
  google_client_id:
    "409286477580-f75rce3ied5c9per3infe111q2bhuf70.apps.googleusercontent.com",
  google_client_secret: "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",
  google_callback_url: "http://localhost:8001/users/auth/google/callback",
  jwt_secret: "socialcircle",
  morgan: {
    mode: 'dev',
    options: {stream: accessLogStream}
}
};
const production = {
  name: "production",
  asset_path: process.env.SOCIALCIRCLE_ASSET_PATH,
  session_cookie_key: process.env.SOCIALCIRCLE_SESSION_COOKIE_KEY,
  db: process.env.SOCIALCIRCLE_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SOCIALCIRCLE_GMAIL_USERNAME,
      pass: process.env.SOCIALCIRCLE_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.SOCIALCIRCLE_JWT_SECRET,
  morgan:{
    mode:'combined',
    options:{stream:accessLogStream}
  }
};

module.exports =
  eval(process.env.SOCIALCIRCLE_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.SOCIALCIRCLE_ENVIRONMENT);
