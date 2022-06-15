const QRCode = require("qrcode");
const generateQR = async (text) => {
  try {
    console.log(await QRCode.toDataURL(text));
  } catch (error) {
    console.log(error);
  }
};

generateQR("http://dumbways.com/");
