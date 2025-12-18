import { TypewriterText } from "./components/type-writer-text";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <TypewriterText 
        text="Chào mừng bạn đến với SEEE Grade!" 
        speed={100}
      />
      
      <p className="mt-4 text-gray-400">
        Dự án dự đoán điểm số sinh viên
      </p>
    </div>
  );
}