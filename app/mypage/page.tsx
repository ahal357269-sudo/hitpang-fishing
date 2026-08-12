"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌟 현재 선택된 탭을 기억하는 주머니 (기본값: 주문내역)
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders");
  const router = useRouter();

  useEffect(() => {
    const fetchMyData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("로그인이 필요한 페이지입니다.");
        router.push("/login");
        return;
      }
      
      setUser(session.user);
      const userEmail = session.user.email;

      // 1. 내 주문 내역 가져오기
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false });
        
      if (orderData) setOrders(orderData);

      // 2. 내가 찜한 상품들 가져오기 (wishlist 장부 조회)
      const { data: likesData } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_email", userEmail);

      if (likesData && likesData.length > 0) {
        // 찜한 상품 번호들만 쏙쏙 뽑아냅니다
        const productIds = likesData.map((like) => like.product_id);
        
        // 해당 번호를 가진 상품 정보들을 products 장부에서 가져옵니다
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);
          
        if (productsData) setWishlistProducts(productsData.reverse());
      }

      setIsLoading(false);
    };

    fetchMyData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  // 찜 목록에서 하트 취소(삭제) 기능
  const removeWishlist = async (productId: number) => {
    if (!user) return;
    
    // 장부에서 삭제
    await supabase
      .from("wishlist")
      .delete()
      .eq("user_email", user.email)
      .eq("product_id", productId);
      
    // 화면에서도 즉시 지워주기
    setWishlistProducts(wishlistProducts.filter(p => p.id !== productId));
    alert("찜 목록에서 삭제되었습니다.");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      
      {/* 헤더 부분 */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <div className="text-sm font-bold text-gray-600 flex items-center gap-4">
            <a href="/" className="hover:text-blue-600 transition">홈으로</a>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">로그아웃</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* 회원 정보 요약 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-black">
            {user?.user_metadata?.name ? user.user_metadata.name[0] : "👤"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.user_metadata?.name || user?.email?.split('@')[0]}님, 환영합니다!
            </h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        {/* 🌟 탭 메뉴 (주문내역 vs 찜목록) */}
        <div className="flex mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-4 font-bold text-lg text-center transition-all ${
              activeTab === "orders" 
              ? "text-blue-600 border-b-4 border-blue-600" 
              : "text-gray-400 hover:text-gray-600"
            }`}
          >
            📦 내 주문 내역
          </button>
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 py-4 font-bold text-lg text-center transition-all ${
              activeTab === "wishlist" 
              ? "text-red-500 border-b-4 border-red-500" 
              : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ❤️ 나의 찜 목록 ({wishlistProducts.length})
          </button>
        </div>

        {/* 탭 내용 보여주기 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          
          {/* 1. 주문 내역 화면 */}
          {activeTab === "orders" && (
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <span className="text-4xl mb-4 block">📦</span>
                  <p className="font-semibold">아직 주문하신 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3 text-sm">
                        <span className="font-bold text-gray-600">{new Date(order.created_at).toLocaleDateString()} 주문</span>
                        <span className={`font-bold px-3 py-1 rounded-full ${order.status === '결제완료' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4 items-center bg-white p-3 rounded-lg border border-gray-100">
                            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                              {item.image_url ? <img src={item.image_url} alt="상품" className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">이미지</span>}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-blue-600 text-sm font-semibold">{item.price}원</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-gray-500 font-bold">총 결제금액</span>
                        <span className="text-xl font-black text-red-600">{order.total_amount?.toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. 🌟 나의 찜 목록 화면 */}
          {activeTab === "wishlist" && (
            <div className="p-6 bg-gray-50/30">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <span className="text-4xl mb-4 block">💔</span>
                  <p className="font-semibold">아직 찜한 상품이 없습니다.</p>
                  <p className="text-sm mt-2">마음에 드는 상품에 하트를 눌러보세요!</p>
                  <a href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">쇼핑하러 가기</a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistProducts.map((product, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition relative group">
                      
                      {/* 삭제 버튼(X) */}
                      <button 
                        onClick={() => removeWishlist(product.id)}
                        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"
                        title="찜 취소"
                      >
                        ✕
                      </button>

                      <a href={`/product/${product.id}`} className="block">
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">NO IMG</div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-blue-600 font-bold mb-1">{product.category}</p>
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-2">{product.name}</h3>
                          <p className="text-red-600 font-black">{product.price}원</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}