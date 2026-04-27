import QRCode from "qrcode.react";
import QRCodeBox from "../components/QRCodeBox";

export default function QRCodeBox() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.qrContainer}>
        <QRCode
          value="https://qrsolutions-phi.vercel.app"
          size={160}
          bgColor="#000000"
          fgColor="#f5c542"
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    padding: "16px",
    border: "2px solid #f5c542",
    borderRadius: "12px",
    background: "#000",
  },
};