"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchProductsSafely = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data.reverse()); 
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    const loadCartCount = () => {
      try {
        const existingCart = localStorage.getItem("hitpang_cart");
        if (existingCart) {
          const cartArray = JSON.parse(existingCart);
          if (Array.isArray(cartArray)) {
            setCartCount(cartArray.length);
          } else {
            localStorage.removeItem("hitpang_cart"); // 데이터가 꼬여있으면 삭제
          }
        }
      } catch (error) {
        localStorage.removeItem("hitpang_cart");
      }
    };

    fetchProductsSafely();
    checkUser();
    loadCartCount();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert("안전하게 로그아웃 되었습니다.");
  };

  // 🌟 강력해진 무적의 장바구니 담기 기능! (에러 시 자동 초기화)
  const addToCart = (product: any) => {
    try {
      const existingCart = localStorage.getItem("hitpang_cart");
      let cartArray = [];
      
      if (existingCart) {
        cartArray = JSON.parse(existingCart);
        if (!Array.isArray(cartArray)) {
          cartArray = []; // 배열이 아니면 깡통으로 만듦
        }
      }

      cartArray.push(product);
      localStorage.setItem("hitpang_cart", JSON.stringify(cartArray));
      setCartCount(cartArray.length);
      alert(`[${product.name}] 상품이 장바구니에 담겼습니다! 🛒`);
      
    } catch (error) {
      // 브라우저 기억장치가 완전히 꼬였을 경우, 싹 비우고 새로 담습니다!
      console.log("장바구니 데이터 초기화 후 다시 담습니다.");
      const newCart = [product];
      localStorage.setItem("hitpang_cart", JSON.stringify(newCart));
      setCartCount(1);
      alert(`[${product.name}] 상품이 장바구니에 담겼습니다! 🛒`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          
          <nav className="hidden md:flex space-x-8 font-semibold text-gray-600">
            <a href="#" className="hover:text-blue-600 transition">베스트</a>
            <a href="#" className="hover:text-blue-600 transition">낚싯대</a>
            <a href="#" className="hover:text-blue-600 transition">릴</a>
            <a href="#" className="hover:text-blue-600 transition">채비/소품</a>
          </nav>
          
          <div className="flex items-center space-x-4 md:space-x-5">
            {user ? (
              <div className="hidden sm:flex items-center space-x-4 text-sm font-semibold text-gray-500">
                <span className="text-blue-600 font-bold">
                  {user.user_metadata?.name ? `${user.user_metadata.name}님` : `${user.email}님`}
                </span>
                <span className="text-gray-300">|</span>
                <a href="/mypage" className="hover:text-blue-600 transition font-bold text-gray-700">마이페이지</a>
                <button onClick={handleLogout} className="hover:text-red-600 transition cursor-pointer">로그아웃</button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4 text-sm font-semibold text-gray-500">
                <a href="/login" className="hover:text-blue-600 transition">로그인</a>
                <a href="/signup" className="hover:text-blue-600 transition">회원가입</a>
                <span className="text-gray-300">|</span>
                <a href="/mypage" className="hover:text-blue-600 transition">마이페이지</a>
              </div>
            )}
            
            <a href="/cart" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span>장바구니 ({cartCount})</span>
            </a>
          </div>
        </div>
      </header>

      <div className="bg-zinc-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4">프리미엄 낚시의 모든 것</h1>
        <p className="text-xl text-gray-400 mb-8">히트팡피싱에서 당신의 런커를 준비하세요.</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-900">🔥 신규 입고 상품</h2>
          <span className="text-gray-500 font-medium">총 {products.length}개의 상품</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            아직 진열된 상품이 없습니다. <br/>관리자 페이지에서 첫 상품을 등록해 보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer border border-gray-100">
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">이미지 준비중</div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-black text-red-600">{product.price}원</span>
                    <button 
                      onClick={() => addToCart(product)} 
                      className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                      담기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 히트팡피싱 (HITPANG FISHING). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}