import FallingNumbers from "@/components/FallingNumbers";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4">
      <FallingNumbers count={15} speed={1} fontSize={30}/>
      <div className="
        relative flex items-center justify-center
        rounded-[25px]
        px-12 py-10          
        shadow-2xl
        bg-black/60          
        backdrop-blur-md     
        border border-white/10
        text-white
        w-[90%]
        md:w-[60%]
        lg:w-[35%]
      ">
        {children}
      </div>
    </div>
  );
}