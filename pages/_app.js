import "../styles/globals.css";
import { useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { Toaster } from "react-hot-toast";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const network = WalletAdapterNetwork.Testnet;
const endpoint = "https://rpc.testnet.carv.io/rpc";
const wallets = [new BackpackWalletAdapter()];

export default function MyApp({ Component, pageProps }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const checkMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );
      setIsMobile(checkMobile);
    }
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "radial-gradient(circle at center, #020617 0%, #000 100%)",
          color: "#67e8f9",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <img
          src="/images/logo.png"
          alt="CARV NEXUS Logo"
          style={{ width: "90px", marginBottom: "20px", filter: "drop-shadow(0 0 10px #06b6d4)" }}
        />
        <h2 style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
          🚫 CARV NEXUS is optimized for desktop browsers.
          <br />
          Please switch to desktop site to access your dashboard.
        </h2>
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Toaster
            toastOptions={{
              style: {
                background: "#0f172a",
                color: "#67e8f9",
                border: "1px solid #0891b2",
              },
              success: {
                icon: "✅",
              },
              error: {
                icon: "❌",
              },
              duration: 3000,
            }}
          />
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}