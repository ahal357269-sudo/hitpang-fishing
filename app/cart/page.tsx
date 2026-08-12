"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// 🌟 방금 설치한 토스 페이먼츠 도구를 불러옵니다!
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk"; 

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

// 🌟 사장님의 토스 테스트 키 적용 완료!
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 토스 페이먼츠 결제창 상태 관리
  const [paymentWidget, setPaymentWidget] = useState<any>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };

    const loadCart = () => {
      const existingCart = localStorage.getItem("hitpang_cart");
      if (existingCart) setCartItems(JSON.parse(existingCart));
      setIsLoading(false);
    };

    fetchUser();
    loadCart();
  }, []);

  const removeItem = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("hitpang_cart", JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const priceNumber = parseInt(item.price.replace(/,/g, ""), 10) || 0;
      return total + priceNumber;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = (subtotal >= 50000 || subtotal === 0) ? 0 : 3000; 
  const totalAmount = subtotal + shippingFee;

  // 🌟 [토스 연동 1] 결제창 불러오기
  useEffect(() => {
    if (totalAmount > 0) {
      const initWidget = async () => {
        try {
          // 고객 고유 아이디 (로그인 안했으면 임시 아이디 부여)
          const customerKey = user?.id || "test_guest_customer_123"; 
          const widget = await loadPaymentWidget(clientKey, customerKey);
          setPaymentWidget(widget);
        } catch (error) {
          console.error("토스 결제창 로딩 실패:", error);
        }
      };
      initWidget();
    }
  }, [totalAmount, user]);

  // 🌟 [토스 연동 2] 화면에 결제창 그려주기
  useEffect(() => {
    if (paymentWidget == null) return;

    // 결제수단 위젯 그리기
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget", 
      { value: totalAmount }, 
      { variantKey: "DEFAULT" }
    );
    // 이용약관 위젯 그리기
    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, totalAmount]);

  // 🌟 [핵심] 결제 요청 버튼 누를 때 실행되는 마법!
  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어있습니다!");
      return;
    }
    if (!user) {
      alert("로그인 후 결제가 가능합니다!");
      router.push("/login");
      return;
    }

    try {
      // 토스 결제창 호출! (이때 성공/실패 시 돌아올 주소를 지정합니다)
      await paymentWidget?.requestPayment({
        orderId: `order_${new Date().getTime()}`,
        orderName: cartItems.length > 1 ? `${cartItems[0].name} 외 ${cartItems.length - 1}건` : cartItems[0].name,
        customerName: user.user_metadata?.name || "히트팡 고객",
        customerEmail: user.email,
        successUrl: `${window.location.origin}/success`, // 성공하면 여기로!
        failUrl: `${window.location.origin}/fail`,       // 실패하면 여기로!
      });
    } catch (error) {
      console.error("결제 에러:", error);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">장바구니를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <div className="text-sm text-gray-500 font-semibold hidden md:block">
            <span className="text-blue-600 font-black border-b-2 border-blue-600 pb-1 mr-4">1. 장바구니/결제</span>
            <span className="text-gray-400">2. 주문완료</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">주문서 작성</h2>
          
          {/* 상품 목록 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            {cartItems.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-gray-400">
                <p className="font-semibold text-gray-500">장바구니에 담긴 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xs text-gray-400">이미지</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1 inline-block">{item.category}</span>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <div className="mt-1 font-black text-red-600">{item.price}원</div>
                    </div>
                    <button onClick={() => removeItem(index)} className="p-2 text-gray-400 hover:text-red-500 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🌟 여기에 토스 결제창 위젯이 그려집니다! */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
              <div id="payment-widget" className="w-full" />
              <div id="agreement" className="w-full" />
            </div>
          )}
        </div>

        {/* 오른쪽 결제 요약 패널 */}
        <div className="w-full lg:w-96">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">배송지 정보</h3>
              {user ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong className="text-gray-900">{user.user_metadata?.name || '고객'}</strong>님</p>
                  <p>{user.user_metadata?.phone || '전화번호 미등록'}</p>
                  <p className="mt-2 text-xs bg-white border border-gray-200 p-2 rounded">{user.user_metadata?.address || '기본 배송지를 등록해 주세요.'}</p>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  <p className="mb-3">로그인 후 배송지를 확인할 수 있습니다.</p>
                  <a href="/login" className="block w-full border border-gray-300 bg-white text-center py-2 rounded text-gray-700 font-bold hover:bg-gray-50 transition">로그인 하기</a>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>총 상품금액</span>
                  <span>{subtotal.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>+ {shippingFee.toLocaleString()} 원</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-gray-900">최종 결제금액</span>
                <span className="text-2xl font-black text-red-600">{totalAmount.toLocaleString()} <span className="text-base font-normal text-red-600">원</span></span>
              </div>

              {/* 🌟 토스 결제 호출 버튼! */}
              <button 
                onClick={handlePayment}
                className="w-full bg-[#3182f6] text-white font-black py-4 rounded-lg text-lg hover:bg-blue-700 transition shadow-md mb-2 flex justify-center items-center gap-2"
              >
                {totalAmount.toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}