import '../styles/globals.css';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { clusterApiUrl } from '@solana/web3.js';
import { Toaster } from 'react-hot-toast';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const network = WalletAdapterNetwork.Testnet;
const endpoint = "https://rpc.testnet.carv.io/rpc";
const wallets = [new BackpackWalletAdapter()];

function MyApp({ Component, pageProps }) {
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
export default MyApp;