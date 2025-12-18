'use client';
import { useRouter } from "next/navigation";

import { SignInFieldText } from "./components/sign_in_field_text";
export default function SignIn() {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex w-full gap-2 flex-col" >
        <div className="flex flex-col gap-1">
          <span className="font-lato text-3xl font-bold text-black dark:text-white">
            Đăng nhập vào SEEE Grade!
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-lato text-sm font-bold text-muted-foreground dark:text-white">
            Bạn chưa có tài khoản?&nbsp;&nbsp;&nbsp;
            <button
              type="button"
              tabIndex={-1}
              onClick={() => router.push("/sign_up")}
              className="font-bold text-primary hover:text-pink-600 mt-10 bg-transparent border-none cursor-pointer p-0"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <div className="relative flex w-full items-center">
        <div className="flex-grow border-t border-[#C2C2C2]">
        </div>
      </div>
      <div className="w-full">
        <div className="flex w-full flex-col items-center gap-3 mt-2">
          <SignInFieldText/>
        </div>
      </div>
    </div>
  );
}
