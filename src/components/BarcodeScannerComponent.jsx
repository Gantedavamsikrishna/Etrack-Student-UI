// import React, { useRef, useState } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import { productData } from "../data/sampledata"; // Import productData

// export default function BarcodeScannerComponent({ onDetected }) {
//   const videoRef = useRef(null);
//   const codeReaderRef = useRef(null);
//   const [scanning, setScanning] = useState(false);

//   const startScanner = () => {
//     const codeReader = new BrowserMultiFormatReader();
//     codeReaderRef.current = codeReader;
//     setScanning(true);

//     codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
//       if (result) {
//         const scannedCode = result.getText();
//         console.log("📦 Scanned Barcode:", scannedCode);

//         // Find product in productData
//         const foundProduct = productData.find((p) => p.barcode === scannedCode);
//         onDetected(foundProduct || { barcode: scannedCode }); // Pass product or just barcode if not found

//         codeReader.reset();
//         setScanning(false);
//       }

//       if (err && err.name !== "NotFoundException") {
//         console.error("Unexpected scanning error:", err);
//       }
//     });
//   };

//   const stopScanner = () => {
//     if (codeReaderRef.current) {
//       codeReaderRef.current.reset();
//     }
//     setScanning(false);
//   };

//   return (
//     <div className="text-center">
//       <button
//         onClick={scanning ? stopScanner : startScanner}
//         className="bg-neon-green text-black px-4 py-2 rounded mb-2 hover:bg-green-400"
//       >
//         {scanning ? "Stop Scan" : "Start Scan"}
//       </button>

//       <div style={{ marginTop: 10 }}>
//         <video
//           ref={videoRef}
//           style={{ width: "300px", height: "200px", border: "1px solid #ccc" }}
//           muted
//           playsInline
//           autoPlay
//         />
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { productData } from "../data/sampledata"; // Your sample data

export default function BarcodeScannerComponent({ onDetected }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const startScanner = async () => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    setScanning(true);

    try {
      // Get list of available video input devices
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      // Prefer rear-facing camera on mobile
      const environmentCam = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment")
      );

      // Fallback to first available device
      const selectedDeviceId = environmentCam?.deviceId || devices[0]?.deviceId;

      if (!selectedDeviceId) {
        console.error("❌ No camera devices found.");
        setScanning(false);
        return;
      }

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const scannedCode = result.getText();
            console.log("📦 Scanned Barcode:", scannedCode);

            const foundProduct = productData.find(
              (p) => p.barcode === scannedCode
            );
            onDetected(foundProduct || { barcode: scannedCode });

            codeReader.reset();
            setScanning(false);
          }

          if (err && err.name !== "NotFoundException") {
            console.error("📛 Scanning error:", err);
          }
        }
      );
    } catch (error) {
      console.error("🚫 Error initializing scanner:", error);
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setScanning(false);
  };

  return (
    <div className="text-center">
      <button
        onClick={scanning ? stopScanner : startScanner}
        className="bg-neon-green text-black px-4 py-2 rounded mb-2 hover:bg-green-400"
      >
        {scanning ? "Stop Scan" : "Start Scan"}
      </button>

      <div style={{ marginTop: 10 }}>
        <video
          ref={videoRef}
          style={{ width: "300px", height: "200px", border: "1px solid #ccc" }}
          muted
          playsInline
          autoPlay
        />
      </div>
    </div>
  );
}
