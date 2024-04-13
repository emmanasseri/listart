// layout.js

export const metadata = {
  title: "List Art",
  description: "A decentralized art marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
