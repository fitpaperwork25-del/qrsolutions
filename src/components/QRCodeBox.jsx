import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeBox() {
  return (
    <div style={styles.wrapper}>
      <QRCodeCanvas
        value="https://qrsolutions-phi.vercel.app"
        size={140}
        bgColor="#000000"
        fgColor="#f5c542"
        level="H"
        includeMargin={true}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: "260px",
    margin: "0 auto",
    border: "2px solid #f5c542",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000",
    padding: "16px",
    boxSizing: "border-box",
  },
};