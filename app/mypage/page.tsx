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
  
  // 좌측 배너 메뉴용 상태
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

      // 1. 주문 내역
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false });
      if (orderData) setOrders(orderData);

      // 2. 찜 목록
      const { data: likesData } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_email", userEmail);

      if (likesData && likesData.length > 0) {
        const productIds = likesData.map((like) => like.product_id);
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

  const removeWishlist = async (productId: number) => {
    if (!user) return;
    await supabase.from("wishlist").delete().eq("user_email", user.email).eq("product_id", productId);
    setWishlistProducts(wishlistProducts.filter(p => p.id !== productId));
    alert("찜 목록에서 삭제되었습니다.");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">마이페이지를 불러오는 중입니다...</div>;

  // 주문 상태 갯수 계산기
  const getStatusCount = (statusName: string) => {
    return orders.filter(o => o.status === statusName).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      
      {/* 헤더 */}
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

      <main className="max-w-6xl mx-auto px-4 py-10">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ==========================================
              좌측 배너 (사이드바) 
              ========================================== */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-black">
                  {user?.user_metadata?.name ? user.user_metadata.name[0] : "👤"}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{user?.user_metadata?.name || user?.email?.split('@')[0]}님</h2>
                  <p className="text-gray-400 text-xs truncate mt-1">{user?.email}</p>
                </div>
              </div>
              
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                <button 
                  onClick={() => setActiveTab("orders")} 
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded-xl font-bold transition flex justify-center md:justify-between items-center whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  <span>📦 주문/배송 조회</span>
                  <span className="hidden md:block text-xs opacity-70">&gt;</span>
                </button>
                <button 
                  onClick={() => setActiveTab("wishlist")} 
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded-xl font-bold transition flex justify-center md:justify-between items-center whitespace-nowrap ${activeTab === 'wishlist' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  <span>❤️ 나의 찜 목록</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs shadow-sm ml-2 md:ml-0 ${activeTab === 'wishlist' ? 'bg-white text-blue-600' : 'bg-white text-gray-500'}`}>{wishlistProducts.length}</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ==========================================
              우측 메인 영역 
              ========================================== */}
          <div className="flex-1 w-full">
            
            {activeTab === "orders" && (
              <div className="space-y-8">
                {/* 1. 중앙 주문/배송 현황판 */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">나의 주문 현황 (최근 1개월)</h3>
                  <div className="flex justify-between items-center px-2 md:px-10 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-xl md:text-2xl font-black text-gray-400 mb-2">{getStatusCount('입금대기')}</div>
                      <span className="text-xs md:text-sm font-bold text-gray-500">입금대기</span>
                    </div>
                    <span className="text-gray-200 text-lg md:text-2xl">❯</span>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xl md:text-2xl font-black text-blue-600 mb-2">{getStatusCount('결제완료')}</div>
                      <span className="text-xs md:text-sm font-bold text-blue-600">결제완료</span>
                    </div>
                    <span className="text-gray-200 text-lg md:text-2xl">❯</span>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-xl md:text-2xl font-black text-gray-400 mb-2">{getStatusCount('배송준비')}</div>
                      <span className="text-xs md:text-sm font-bold text-gray-500">상품준비중</span>
                    </div>
                    <span className="text-gray-200 text-lg md:text-2xl">❯</span>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-xl md:text-2xl font-black text-gray-400 mb-2">{getStatusCount('배송중')}</div>
                      <span className="text-xs md:text-sm font-bold text-gray-500">배송중</span>
                    </div>
                    <span className="text-gray-200 text-lg md:text-2xl">❯</span>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-xl md:text-2xl font-black text-gray-400 mb-2">{getStatusCount('배송완료')}</div>
                      <span className="text-xs md:text-sm font-bold text-gray-500">배송완료</span>
                    </div>
                  </div>
                </section>

                {/* 2. 하단 주문 내역 상세 */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">주문 내역 상세</h3>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <span className="text-5xl mb-4 block">📦</span>
                      <p className="font-semibold text-lg">아직 주문하신 내역이 없습니다.</p>
                      <a href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">쇼핑하러 가기</a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-gray-800 mr-3">{new Date(order.created_at).toLocaleDateString()} 주문</span>
                              <span className="text-xs text-gray-400">주문번호: {order.id}</span>
                            </div>
                            <span className={`font-bold px-3 py-1 rounded-full text-xs ${order.status === '결제완료' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="p-5 space-y-4">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="flex gap-4 items-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                                  {item.image_url ? <img src={item.image_url} alt="상품" className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">NO IMG</span>}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900 text-base mb-1">{item.name}</p>
                                  <p className="text-blue-600 font-bold">{item.price}원</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gray-50/50 px-5 py-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 font-bold">총 결제금액</span>
                            <span className="text-xl font-black text-red-600">{order.total_amount?.toLocaleString()}원</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* 3. 찜 목록 화면 */}
            {activeTab === "wishlist" && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                  ❤️ 나의 찜 목록
                </h3>
                
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <span className="text-5xl mb-4 block">💔</span>
                    <p className="font-semibold text-lg">아직 찜한 상품이 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlistProducts.map((product, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-blue-300 transition relative group shadow-sm hover:shadow-md">
                        <button 
                          onClick={() => removeWishlist(product.id)}
                          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"
                          title="찜 취소"
                        >
                          ✕
                        </button>
                        <a href={`/product/${product.id}`} className="block">
                          <div className="aspect-square bg-gray-50 overflow-hidden relative border-b border-gray-100">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-400">NO IMG</div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-[10px] text-blue-600 font-bold mb-1">{product.category}</p>
                            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 h-10">{product.name}</h3>
                            <p className="text-red-600 font-black">{product.price}원</p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}