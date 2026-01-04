import { TypewriterText } from "./components/type-writer-text";
import { Button } from "@mui/material"
import FallingNumbers from "@/components/FallingNumbers";

export default function Home() {
  return (
    <>
    <FallingNumbers count={20} speed={1.5} fontSize={24}/>
    <div className="flex min-h-screen flex-col items-center justify-center p-24 relative z-10">
      <TypewriterText 
        lines={[
          "Chào mừng bạn đến với", 
          "SEEE Grade Project!"
        ]}
        speed={75}
      />
      
      <p className="mt-4 text-gray-400">
        Dự án dự đoán điểm số sinh viên
      </p>
      <div className="flex p-10 gap-6 justify-center">
        <Button
          variant="contained"
          href="/sign_in"
          className="mt-6"
          sx={{
            width: '160px',
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Đăng nhập
        </Button>
        <Button
          variant="contained"
          href="/sign_up"
          className="mt-6"
          sx={{
            width: '160px',
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Đăng ký
        </Button>
      </div>
    </div>
    </>
  );
}