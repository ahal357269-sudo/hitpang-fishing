"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 수파베이스 연결
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 화면이 켜질 때 로컬 스토리지(브라우저 기억장치)에서 장바구니를 꺼내옵니다.
  useEffect(() => {
    // 1. 유저 정보 가져오기 (배송지 표시용)
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };

    // 2. 장바구니 데이터 가져오기
    const loadCart = () => {
      const existingCart = localStorage.getItem("hitpang_cart");
      if (existingCart) {
        setCartItems(JSON.parse(existingCart));
      }
      setIsLoading(false);
    };

    fetchUser();
    loadCart();
  }, []);

  // 🌟 상품 개별 삭제 기능
  const removeItem = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("hitpang_cart", JSON.stringify(updatedCart));
  };

  // 🌟 장바구니 전체 비우기 기능
  const clearCart = () => {
    if(confirm("장바구니를 모두 비우시겠습니까?")) {
      setCartItems([]);
      localStorage.removeItem("hitpang_cart");
    }
  };

  // 💰 자동 금액 계산 로직
  // (상품 가격에서 쉼표를 빼고 숫자로 바꿔서 다 더해줍니다)
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const priceNumber = parseInt(item.price.replace(/,/g, ""), 10) || 0;
      return total + priceNumber;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  // 5만원 이상 무료배송, 아니면 3000원!
  const shippingFee = (subtotal >= 50000 || subtotal === 0) ? 0 : 3000; 
  const totalAmount = subtotal + shippingFee;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">장바구니를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* 1. 상단 심플 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <div className="text-sm text-gray-500 font-semibold">
            <span className="text-blue-600 font-black border-b-2 border-blue-600 pb-1 mr-4">1. 장바구니</span>
            <span className="mr-4 text-gray-400">2. 주문결제</span>
            <span className="text-gray-400">3. 주문완료</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* ================= 좌측: 장바구니 목록 ================= */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">장바구니</h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-4 bg-gray-50 border-b border-gray-200 p-4 text-sm font-semibold text-gray-600 text-center items-center">
              <div className="col-span-1"><input type="checkbox" className="w-4 h-4 cursor-pointer" defaultChecked /></div>
              <div className="col-span-6 text-left">상품정보</div>
              <div className="col-span-2">배송비</div>
              <div className="col-span-2">합계금액</div>
              <div className="col-span-1">삭제</div>
            </div>

            {/* 장바구니 내용물 */}
            {cartItems.length === 0 ? (
              // 텅 빈 장바구니 화면 (사진 참고 반영)
              <div className="py-32 flex flex-col items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 mb-4 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <p className="font-semibold text-gray-500">장바구니에 담긴 상품이 없습니다.</p>
              </div>
            ) : (
              // 상품이 있을 때 목록 띄우기
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center text-center">
                    <div className="col-span-1"><input type="checkbox" className="w-4 h-4 cursor-pointer" defaultChecked /></div>
                    
                    <div className="col-span-6 flex items-center space-x-4 text-left">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-xs text-gray-400">이미지</span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1 inline-block">{item.category}</span>
                        <h3 className="font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-gray-500">기본배송</div>
                    <div className="col-span-2 font-black text-red-600">{item.price}원</div>
                    <div className="col-span-1">
                      <button onClick={() => removeItem(index)} className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-500 transition">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* 🌟 하단 안내 바 (5만원 이상 무료배송 계산) */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-sm text-gray-700">
              상품금액 <strong className="text-black">{subtotal.toLocaleString()}원</strong> + 
              배송비 <strong className="text-black">{shippingFee.toLocaleString()}원</strong> = 
              <strong className="text-red-600 ml-1">{totalAmount.toLocaleString()}원</strong> 
              <span className="text-gray-500 ml-2">(5만원 이상 무료배송)</span>
            </div>
          </div>

          {/* 좌측 하단 버튼들 */}
          <div className="flex justify-between items-center mt-6">
            <button onClick={clearCart} className="bg-gray-700 text-white px-5 py-2.5 rounded text-sm font-bold hover:bg-black transition">
              전체 상품 삭제
            </button>
            <div className="space-x-2">
              <button className="bg-white border border-gray-300 text-gray-800 px-5 py-2.5 rounded text-sm font-bold hover:bg-gray-50 transition">
                선택 상품 주문
              </button>
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded text-sm font-bold hover:bg-blue-700 transition">
                전체 상품 주문
              </button>
            </div>
          </div>
        </div>

        {/* ================= 우측: 주문 요약 및 결제창 (Sticky) ================= */}
        <div className="w-full lg:w-80">
          <div className="sticky top-24 bg-white border border-blue-600 rounded-xl shadow-lg overflow-hidden">
            
            {/* 배송지 정보 (로그인 시 연동) */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">배송지</h3>
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

            {/* 결제 금액 요약 */}
            <div className="p-6">
              <p className="font-bold text-sm mb-4">전체상품 : {cartItems.length}개</p>
              
              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>주문금액</span>
                  <span>{subtotal.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>+ {shippingFee.toLocaleString()} 원</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-gray-900">결제 예정금액</span>
                <span className="text-2xl font-black text-red-600">{totalAmount.toLocaleString()} <span className="text-base font-normal text-red-600">원</span></span>
              </div>

              {/* 주문 버튼 */}
              <button className="w-full bg-blue-600 text-white font-black py-4 rounded-lg text-lg hover:bg-blue-700 transition shadow-md mb-2">
                주문하기
              </button>
              <a href="/" className="block text-center w-full bg-white border border-blue-600 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition">
                쇼핑 계속하기
              </a>
            </div>

            {/* NPay 등 안내 문구 */}
            <div className="p-4 bg-gray-50 text-xs text-gray-500 leading-relaxed border-t border-gray-100">
              * 주문결제 단계에서 <strong className="text-green-500">Npay</strong> 결제가 가능합니다.<br/>
              * 히트팡 회원 등급 구매 횟수 포함 및 적립금 혜택이 적용됩니다.
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}