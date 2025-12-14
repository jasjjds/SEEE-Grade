import Image from "next/image";
import { SignInFieldText } from "./components/sign_in_field_text";
export default function SignIn() {
  return (
    <>
    <div className="w-[250px]">
      <SignInFieldText/>
    </div>
    </>
  );
}
