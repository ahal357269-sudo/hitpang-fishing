"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// 수파베이스 연결
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOrder = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (paymentKey && orderId && amount) {
        try {
          // 1. 현재 결제한 손님의 로그인 정보 확인
          const { data: { session } } = await supabase.auth.getSession();
          const userEmail = session?.user?.email || "비회원";

          // 2. 장바구니에 있던 상품들 가져오기
          const existingCart = localStorage.getItem("hitpang_cart");
          const cartItems = existingCart ? JSON.parse(existingCart) : [];

          // 3. 🌟 수파베이스 'orders' 장부에 결제 내역 완벽하게 저장! 
          // (새로고침 시 중복 저장을 막기 위해 장바구니에 물건이 있을 때만 저장합니다)
          if (cartItems.length > 0) {
            const { error } = await supabase.from("orders").insert([
              { 
                user_email: userEmail, 
                items: cartItems, 
                total_amount: Number(amount),
                status: "결제완료"
              }
            ]);
            
            if (error) console.error("주문 저장 실패:", error);

            // 4. 저장이 끝났으니 장바구니를 깨끗하게 비워줍니다!
            localStorage.removeItem("hitpang_cart");
          }

          // 자연스러운 로딩 연출 (0.5초)
          setTimeout(() => {
            setIsProcessing(false);
          }, 500);

        } catch (error) {
          console.error("주문 처리 에러:", error);
          setIsProcessing(false);
        }
      } else {
        alert("비정상적인 접근입니다.");
        router.push("/");
      }
    };

    processOrder();
  }, [searchParams, router]);

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">
      {isProcessing ? (
        <div className="py-10">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800">결제 확인 중...</h2>
          <p className="text-gray-500 mt-2 text-sm">안전하게 결제 내역을 장부에 기록하고 있습니다.</p>
        </div>
      ) : (
        <div className="py-6">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-3xl font-black text-blue-600 mb-4 tracking-tight">결제 완료!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            주문이 정상적으로 처리되었습니다.<br/>
            사장님의 런커 도전을 응원합니다! 🎣
          </p>
          
          {/* 영수증 요약 */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left text-sm text-gray-700 space-y-3 border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500 font-bold">주문번호</span>
              <span className="font-mono font-bold text-gray-900">{searchParams.get("orderId")}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500 font-bold">결제금액</span>
              <span className="font-black text-red-600 text-lg">{Number(searchParams.get("amount")).toLocaleString()}원</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push("/mypage")} 
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md text-lg"
            >
              내 주문 내역 보기
            </button>
            <button 
              onClick={() => router.push("/")} 
              className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition text-lg"
            >
              쇼핑 계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-center font-bold text-gray-500">로딩 중...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}