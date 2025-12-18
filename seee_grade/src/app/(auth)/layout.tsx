export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="relative flex min-h-screen items-center justify-center bg-[url(/background/background1.png)] bg-cover bg-center bg-no-repeat p-4">
      <div
        className="
          relative flex items-center justify-center
          rounded-[25px]
          shadow-[0_4px_16px_0_rgba(139,139,139,0.25)]
          px-30 py-7
          bg-white dark:bg-[#1e1e1e]
          text-gray-900 dark:text-white
          dark:border dark:border-gray-700
          dark:bg-gray-800
        "
      >
        {children}
      </div>
    </div>
  );
}