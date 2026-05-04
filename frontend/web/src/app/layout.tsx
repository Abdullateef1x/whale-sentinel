import Providers from "./providers";
import "@/app/globals.css"
import "@solana/wallet-adapter-react-ui/styles.css";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}