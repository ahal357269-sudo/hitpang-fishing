"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("낚싯대");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState("add_product");
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: productData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (productData) setProducts(productData);
    
    const { data: orderData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (orderData) setOrders(orderData);
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert("모든 필수 항목을 입력해 주세요!");
      return;
    }
    
    setIsSubmitting(true);
    let finalImageUrl = "";

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, imageFile);
        if (uploadError) throw new Error("이미지 업로드 실패: " + uploadError.message);
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("products").insert([
        { name, price: parseInt(price), category, image_url: finalImageUrl }
      ]);
      if (insertError) throw insertError;

      alert("🎉 상품이 성공적으로 등록되었습니다!");
      setName(""); setPrice(""); setCategory("낚싯대");
      setImageFile(null); setImagePreview("");
      
      fetchData();
      setActiveMenu("manage_products");
    } catch (error: any) {
      alert("오류가 발생했습니다: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (confirm("정말 이 상품을 삭제하시겠습니까? (복구 불가)")) {
      await supabase.from("products").delete().eq("id", productId);
      alert("상품이 삭제되었습니다.");
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) {
      alert(`주문 상태가 [${newStatus}]로 변경되었습니다.`);
      fetchData(); 
    } else {
      alert("상태 변경에 실패했습니다.");
    }
  };

  // 🌟 새롭게 추가된 주문 내역 삭제 기능!
  const handleDeleteOrder = async (orderId: number) => {
    if (confirm("테스트 주문 내역을 완전히 삭제하시겠습니까? (복구 불가)")) {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (!error) {
        alert("주문 내역이 깔끔하게 삭제되었습니다.");
        fetchData(); // 삭제 후 목록 새로고침
      } else {
        alert("주문 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 xl:pb-0">
      
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
            HITPANG<span className="text-gray-800">ADMIN</span>
          </a>
          <a href="/" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition">
            쇼핑몰 홈으로 돌아가기
          </a>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* ==========================================
              1단 (좌측): 관리자 사이드바
              ========================================== */}
          <aside className="w-full xl:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-6 xl:sticky xl:top-24 text-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-black">👑</div>
                <div className="overflow-hidden">
                  <h2 className="text-lg font-bold truncate">최고 관리자</h2>
                  <p className="text-gray-400 text-xs truncate mt-1">Admin Mode</p>
                </div>
              </div>
              
              <nav className="flex xl:flex-col gap-2 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 hide-scrollbar">
                <button onClick={() => setActiveMenu("add_product")} className={`flex-1 xl:w-full text-left px-4 py-3 rounded-xl font-bold transition flex justify-center xl:justify-between items-center whitespace-nowrap ${activeMenu === 'add_product' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>
                  <span>📝 새 상품 등록</span>
                  <span className="hidden xl:block text-xs opacity-70">&gt;</span>
                </button>
                <button onClick={() => setActiveMenu("manage_products")} className={`flex-1 xl:w-full text-left px-4 py-3 rounded-xl font-bold transition flex justify-center xl:justify-between items-center whitespace-nowrap ${activeMenu === 'manage_products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}>
                  <span>📦 등록 상품 관리</span>
                  <span className="hidden xl:block text-xs opacity-70">&gt;</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ==========================================
              2단 (중앙): 상품 작업 공간
              ========================================== */}
          <div className="flex-1 w-full min-w-0">
            
            {activeMenu === "add_product" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="border-b border-gray-100 pb-6 mb-8">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">📝</span> 상품 직접 등록
                  </h1>
                  <p className="text-gray-500 font-medium">새로운 낚시용품의 정보를 입력하고 사진을 첨부해 주세요.</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option value="낚싯대">낚싯대</option>
                      <option value="릴">릴</option>
                      <option value="채비/소품">채비/소품</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">상품명</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 시마노 스텔라 SW" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">판매 가격 (숫자만 입력)</label>
                    <div className="relative">
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="예: 150000" className="w-full border border-gray-300 rounded-lg p-3 pr-10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      <span className="absolute right-4 top-3 text-gray-400 font-bold">원</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">상품 이미지 (직접 업로드)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative">
                      {imagePreview ? (
                        <div className="relative w-full aspect-square max-w-[200px] mb-4">
                          <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" />
                          <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); }} className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full font-bold shadow-md hover:bg-red-600 flex items-center justify-center">✕</button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <span className="text-5xl block mb-3 opacity-80">📸</span>
                          <p className="text-gray-600 font-bold text-sm mb-1">클릭하여 사진을 선택하거나</p>
                          <p className="text-gray-400 text-xs">파일을 이곳으로 끌어다 놓으세요.</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-4 rounded-xl text-lg shadow-md transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                      {isSubmitting ? "사진을 업로드하며 등록하는 중..." : "상품 등록 완료하기"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeMenu === "manage_products" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
                <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">📦</span> 등록 상품 리스트
                    </h1>
                    <p className="text-gray-500 font-medium">쇼핑몰에 등록된 모든 상품을 확인하고 관리하세요.</p>
                  </div>
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">총 {products.length}개</span>
                </div>

                {isLoading ? (
                  <div className="text-center py-20 text-gray-400 font-bold">목록을 불러오는 중입니다...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <span className="text-5xl mb-4 block">텅</span>
                    <p className="font-semibold text-lg">아직 등록된 상품이 없거나, RLS가 켜져있습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product, idx) => (
                      <div key={idx} className="flex flex-col p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-white">
                        <div className="flex gap-4 mb-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="flex items-center justify-center h-full text-[10px] text-gray-400">NO IMG</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1 inline-block">{product.category}</span>
                            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight h-10">{product.name}</h3>
                            <p className="text-red-600 font-black text-sm mt-1">{product.price.toLocaleString()}원</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteProduct(product.id)} className="w-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg text-sm font-bold transition">
                          상품 삭제하기
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ==========================================
              3단 (우측): 배송/주문 실시간 모니터링 창
              ========================================== */}
          <aside className="w-full xl:w-[450px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full xl:h-[calc(100vh-80px)] xl:sticky xl:top-20">
              
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span className="text-green-500 relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    실시간 주문 현황
                  </h2>
                </div>
                <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded-full shadow-sm">{orders.length}건</span>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
                {isLoading ? (
                  <div className="text-center py-20 text-gray-400 font-bold">주문 내역을 불러오는 중...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <span className="text-4xl mb-3 block">📭</span>
                    <p className="font-semibold text-sm">새로운 주문이 없습니다.</p>
                  </div>
                ) : (
                  orders.map((order, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-blue-300 transition">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-400 font-semibold">{new Date(order.created_at).toLocaleString()}</div>
                          <div className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{order.user_email}</div>
                        </div>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`border rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer ${order.status === '결제완료' ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white'}`}
                        >
                          <option value="입금대기">입금대기</option>
                          <option value="결제완료">결제완료</option>
                          <option value="배송준비">배송준비</option>
                          <option value="배송중">배송중</option>
                          <option value="배송완료">배송완료</option>
                        </select>
                      </div>

                      <div className="p-4 space-y-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-3 items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                              {item.image_url ? <img src={item.image_url} alt="상품" className="w-full h-full object-cover" /> : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-xs truncate">{item.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 🌟 하단부에 내역 삭제 버튼과 결제 금액을 나란히 배치했습니다! */}
                      <div className="bg-blue-50/30 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                        <button 
                          onClick={() => handleDeleteOrder(order.id)} 
                          className="text-xs text-gray-400 hover:text-red-500 font-bold underline underline-offset-2 transition"
                        >
                          내역 삭제
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs font-bold">결제금액</span>
                          <span className="text-base font-black text-red-600">{order.total_amount?.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}