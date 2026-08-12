"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

// 🌟 사장님(관리자) 이메일을 여기에 등록해 둡니다! (여러 명이면 쉼표로 추가 가능)
const ADMIN_EMAILS = ["swn1212@naver.com"];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  
  const [recentViews, setRecentViews] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductsSafely = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data.reverse()); 
    };

    const checkUserAndLikes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: likesData } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_email", session.user.email);
        if (likesData) setLikedProducts(likesData.map((like) => like.product_id));
      }
    };

    const loadLocalData = () => {
      try {
        const existingCart = localStorage.getItem("hitpang_cart");
        if (existingCart) {
          const cartArray = JSON.parse(existingCart);
          if (Array.isArray(cartArray)) setCartCount(cartArray.length);
        }
        
        const recent = localStorage.getItem("hitpang_recent");
        if (recent) setRecentViews(JSON.parse(recent));
      } catch (error) {
        console.error("메모장 읽기 실패:", error);
      }
    };

    fetchProductsSafely();
    checkUserAndLikes();
    loadLocalData();

    window.addEventListener("focus", loadLocalData);
    window.addEventListener("popstate", loadLocalData);
    
    return () => {
      window.removeEventListener("focus", loadLocalData);
      window.removeEventListener("popstate", loadLocalData);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLikedProducts([]); 
    alert("안전하게 로그아웃 되었습니다.");
  };

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    try {
      const existingCart = localStorage.getItem("hitpang_cart");
      let cartArray = existingCart ? JSON.parse(existingCart) : [];
      if (!Array.isArray(cartArray)) cartArray = [];

      cartArray.push(product);
      localStorage.setItem("hitpang_cart", JSON.stringify(cartArray));
      setCartCount(cartArray.length);
      alert(`[${product.name}] 상품이 장바구니에 담겼습니다! 🛒`);
    } catch (error) {}
  };

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

  const filteredProducts = products.filter((product) => {
    let categoryMatch = false;
    if (selectedCategory === "전체" || selectedCategory === "베스트") categoryMatch = true;
    else if (selectedCategory === "채비/소품") {
      categoryMatch = product.category.includes("채비") || product.category.includes("소품");
    } else {
      categoryMatch = product.category.includes(selectedCategory);
    }
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const categories = ["전체", "베스트", "낚싯대", "릴", "채비/소품"];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 lg:pb-0 relative">
      
      {/* 🌟 최근 본 상품 날개 배너 */}
      {recentViews.length > 0 && (
        <div className="hidden md:block fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 w-24 lg:w-28 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] overflow-hidden">
          <div className="bg-blue-600 text-white text-[10px] font-bold text-center py-2">
            최근 본 상품
          </div>
          <div className="p-2 space-y-2">
            {recentViews.map((recent, idx) => (
              <a key={idx} href={`/product/${recent.id}`} className="block group">
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100 mb-1">
                  {recent.image_url ? (
                    <img src={recent.image_url} alt={recent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <span className="text-[8px] text-gray-400 flex items-center justify-center h-full">NO IMG</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-600 font-medium line-clamp-1 text-center group-hover:text-blue-600 transition">
                  {recent.name}
                </p>
              </a>
            ))}
          </div>
          <div className="border-t border-gray-100 py-2 flex justify-center">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-4 border-b border-gray-100 gap-4">
            <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer whitespace-nowrap">
              HITPANG<span className="text-gray-800">FISHING</span>
            </a>
            <div className="relative w-full order-3 lg:order-none lg:w-auto lg:flex-1 max-w-xl">
              <input 
                type="text" 
                placeholder="어떤 상품을 찾으시나요?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-full py-2.5 px-4 pl-11 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm bg-gray-50 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="hidden lg:flex items-center space-x-3 text-sm font-semibold text-gray-500 whitespace-nowrap order-2 lg:order-none">
              {user ? (
                <>
                  <span className="text-blue-600 font-bold max-w-[150px] truncate" title={user.email}>{user.user_metadata?.name ? `${user.user_metadata.name}님` : `${user.email}님`}</span>
                  <span className="text-gray-300">|</span>
                  
                  {/* 🌟 사장님(관리자) 이메일일 때만 보이는 '관리자 페이지' 버튼 */}
                  {ADMIN_EMAILS.includes(user.email) && (
                    <>
                      <a href="/admin" className="text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full font-black transition flex items-center gap-1">
                        <span>👑</span> 관리자
                      </a>
                      <span className="text-gray-300">|</span>
                    </>
                  )}

                  <a href="/mypage" className="hover:text-blue-600 transition font-bold text-gray-700">마이페이지</a>
                  <button onClick={handleLogout} className="hover:text-red-600 transition cursor-pointer">로그아웃</button>
                </>
              ) : (
                <>
                  <a href="/login" className="hover:text-blue-600 transition">로그인</a>
                  <a href="/signup" className="hover:text-blue-600 transition">회원가입</a>
                  <span className="text-gray-300">|</span>
                  <a href="/mypage" className="hover:text-blue-600 transition">마이페이지</a>
                </>
              )}
              <a href="/cart" className="ml-4 bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition flex items-center space-x-2 shadow-sm cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                <span>장바구니 ({cartCount})</span>
              </a>
            </div>
          </div>
          <div className="py-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <nav className="flex space-x-6 md:space-x-8 font-semibold text-gray-600 text-base px-2">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => {
                    if (cat === "전체" || cat === "베스트") {
                      setSelectedCategory(cat);
                    } else {
                      window.location.href = `/category/${cat}`;
                    }
                  }} 
                  className={`transition py-2 ${selectedCategory === cat ? "text-blue-600 font-black border-b-2 border-blue-600" : "hover:text-blue-600"}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-zinc-900 text-white py-16 md:py-20 px-4 text-center">
        <h1 className="text-3xl md:text-6xl font-black mb-4">프리미엄 낚시의 모든 것</h1>
        <p className="text-sm md:text-xl text-gray-400 md:mb-8">히트팡피싱에서 당신의 런커를 준비하세요.</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex justify-between items-end mb-6 border-b pb-3">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">
            {searchQuery ? `🔍 '${searchQuery}' 검색 결과` : (selectedCategory === "전체" ? "🔥 신규 입고 상품" : `🎯 ${selectedCategory} 추천 상품`)}
          </h2>
          <span className="text-xs md:text-sm text-gray-500 font-medium">총 {filteredProducts.length}개</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 md:py-32 text-gray-500">
            <span className="text-4xl mb-4 block">🎣</span>
            <p className="font-bold">조건에 맞는 상품을 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col relative">
                
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
                    <span className="absolute top-2 left-2 bg-white/90 text-blue-700 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {product.category}
                    </span>
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

      {/* 모바일 하단바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 shadow-[0_-5px_10px_-5px_rgba(0,0,0,0.1)] pb-safe">
        <a href="/" className="flex flex-col items-center text-blue-600 p-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg><span className="text-[10px] font-bold">홈</span></a>
        
        <a href="/cart" className="flex flex-col items-center text-gray-400 hover:text-blue-600 p-2 relative"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>{cartCount > 0 && <span className="absolute top-1 right-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>}<span className="text-[10px] font-bold">장바구니</span></a>
        
        <a href="/mypage" className="flex flex-col items-center text-gray-400 hover:text-blue-600 p-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg><span className="text-[10px] font-bold">마이페이지</span></a>

        {/* 🌟 모바일에서도 관리자 계정이면 버튼 표시! */}
        {user && ADMIN_EMAILS.includes(user.email) && (
          <a href="/admin" className="flex flex-col items-center text-red-500 hover:text-red-700 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.827M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            <span className="text-[10px] font-bold">관리자</span>
          </a>
        )}
      </div>
    </div>
  );
}