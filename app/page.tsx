"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 수파베이스 장부 연결!
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  // 화면이 켜질 때 DB 장부에서 상품 목록을 가져옵니다.
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false }); // 최신순 정렬 (에러 났던 부분 빼고 기본 순서로 가져오게 설정할 수도 있지만, 일단 DB대로 가져옵니다)
      
      // 만약 id 에러가 났다면 아래 코드로 가져옵니다 (정렬 뺌)
      // const { data, error } = await supabase.from("products").select("*");

      if (data) {
        setProducts(data);
      }
    };
    
    // (안전장치) id 컬럼이 없어서 에러가 났었으니, 정렬을 뺀 버전으로 안전하게 가져옵니다.
    const fetchProductsSafely = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (data) setProducts(data);
    };

    fetchProductsSafely();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 1. 쇼핑몰 상단 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-600 tracking-tighter">
            HITPANG<span className="text-gray-800">FISHING</span>
          </div>
          <nav className="hidden md:flex space-x-8 font-semibold text-gray-600">
            <a href="#" className="hover:text-blue-600 transition">베스트</a>
            <a href="#" className="hover:text-blue-600 transition">낚싯대</a>
            <a href="#" className="hover:text-blue-600 transition">릴</a>
            <a href="#" className="hover:text-blue-600 transition">채비/소품</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="/admin" className="text-sm text-gray-400 hover:text-gray-600">관리자</a>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition">
              장바구니 (0)
            </button>
          </div>
        </div>
      </header>

      {/* 2. 메인 배너 이미지 */}
      <div className="bg-zinc-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4">프리미엄 낚시의 모든 것</h1>
        <p className="text-xl text-gray-400 mb-8">히트팡피싱에서 당신의 런커를 준비하세요.</p>
      </div>

      {/* 3. 진짜 상품이 진열되는 진열대 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-900">🔥 신규 입고 상품</h2>
          <span className="text-gray-500 font-medium">총 {products.length}개의 상품</span>
        </div>

        {/* 상품이 없을 때 보여줄 화면 */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            아직 진열된 상품이 없습니다. <br/>관리자 페이지에서 첫 상품을 등록해 보세요!
          </div>
        ) : (
          /* 상품 카드 그리드 (자동으로 줄바꿈 됨) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer border border-gray-100">
                
                {/* 상품 이미지 */}
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {/* 이미지가 없으면 회색 네모를, 있으면 진짜 이미지를 보여줍니다 */}
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">이미지 준비중</div>
                  )}
                  {/* 카테고리 뱃지 */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                {/* 상품 정보 */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-black text-red-600">{product.price}원</span>
                    <button className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-bold transition">
                      담기
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. 쇼핑몰 하단 (푸터) */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 히트팡피싱 (HITPANG FISHING). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}