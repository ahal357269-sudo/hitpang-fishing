"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CategoryPage() {
  const params = useParams();
  const rawCategoryName = params?.name as string;
  
  // 🌟 핵심: 주소창의 한글(예: %EB%A6%B4)을 원래 글자('릴')로 예쁘게 풀어줍니다.
  const categoryName = rawCategoryName ? decodeURIComponent(rawCategoryName) : "";

  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      // 1. 해당 카테고리 단어가 포함된 상품만 수파베이스에서 골라오기
      const { data } = await supabase
        .from("products")
        .select("*")
        .ilike("category", `%${categoryName}%`); 
      
      if (data) setProducts(data.reverse());

      // 2. 유저 정보 & 찜(하트) 목록 가져오기
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: likesData } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_email", session.user.email);
        if (likesData) setLikedProducts(likesData.map((like) => like.product_id));
      }
      setIsLoading(false);
    };

    if (categoryName) fetchCategoryProducts();
  }, [categoryName]);

  // 하트 찜하기 기능
  const toggleLike = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault(); 
    if (!user) {
      alert("로그인 후 찜하기 기능을 이용할 수 있습니다! ❤️");
      return;
    }
    if (likedProducts.includes(productId)) {
      await supabase.from("wishlist").delete().eq("user_email", user.email).eq("product_id", productId);
      setLikedProducts(likedProducts.filter(id => id !== productId));
    } else {
      await supabase.from("wishlist").insert([{ user_email: user.email, product_id: productId }]);
      setLikedProducts([...likedProducts, productId]);
    }
  };

  // 장바구니 담기
  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    try {
      const existingCart = localStorage.getItem("hitpang_cart");
      let cartArray = existingCart ? JSON.parse(existingCart) : [];
      if (!Array.isArray(cartArray)) cartArray = [];
      cartArray.push(product);
      localStorage.setItem("hitpang_cart", JSON.stringify(cartArray));
      alert(`[${product.name}] 상품이 장바구니에 담겼습니다! 🛒`);
    } catch (error) {}
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">카테고리 상품을 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      
      {/* 깔끔한 미니 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <a href="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">
            ← 메인으로 돌아가기
          </a>
        </div>
      </header>

      {/* 카테고리 타이틀 배너 */}
      <div className="bg-blue-600 text-white py-14 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-3">{categoryName}</h1>
        <p className="text-sm md:text-lg text-blue-100 font-medium">해당 카테고리의 인기 상품들을 만나보세요.</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-6 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">전체 상품</h2>
          <span className="text-sm text-gray-500 font-medium">총 {products.length}개</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="text-4xl mb-4 block">🎣</span>
            <p className="font-bold">이 카테고리에는 아직 등록된 상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col relative">
                
                {/* 하트 찜하기 */}
                <button onClick={(e) => toggleLike(e, product.id)} className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill={likedProducts.includes(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 md:w-6 md:h-6 ${likedProducts.includes(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>

                <a href={`/product/${product.id}`} className="block flex-1">
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">이미지</div>
                    )}
                  </div>
                  <div className="p-3 md:p-5 pb-0">
                    <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                  </div>
                </a>
                <div className="p-3 md:p-5 pt-2 mt-auto">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-1">
                    <span className="text-base md:text-xl font-black text-red-600">{product.price}원</span>
                    <button onClick={(e) => addToCart(e, product)} className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition w-full md:w-auto text-center">
                      담기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}