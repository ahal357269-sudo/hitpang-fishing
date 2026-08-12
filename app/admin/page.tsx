"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = "swn1212@naver.com"; 

export default function AdminPage() {
  // 🌟 현재 탭 상태 (기본값: 상품 관리)
  const [activeTab, setActiveTab] = useState("products"); 

  // 상품 관련 상태
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("릴");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // 🌟 주문 관련 상태
  const [orders, setOrders] = useState<any[]>([]);

  // 인증 상태
  const [authStatus, setAuthStatus] = useState("loading"); 
  const [currentEmail, setCurrentEmail] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAuthStatus("no_login");
        return;
      }

      const userEmail = session.user.email;
      setCurrentEmail(userEmail || "");

      if (userEmail?.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) {
        setAuthStatus("fail"); 
        return;
      }

      setAuthStatus("success");
      fetchProducts();
      fetchOrders(); // 🌟 사장님 통과 시 주문 내역도 불러옵니다!
    };

    checkAdmin();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data.reverse());
  };

  // 🌟 모든 주문 내역 불러오기
  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([
      { category, name, price, image_url: imageUrl }
    ]);

    if (error) alert("앗, 에러: " + error.message);
    else {
      alert("신상품 등록 완료! 🎉");
      setName(""); setPrice(""); setImageUrl("");
      fetchProducts(); 
    }
  };

  // 🌟 배송 상태 변경 마법!
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    } else {
      alert(`주문 상태가 [${newStatus}](으)로 변경되었습니다!`);
      fetchOrders(); // 화면 새로고침
    }
  };

  if (authStatus === "loading") return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 bg-gray-50">🔐 신원 확인 중...</div>;
  if (authStatus === "no_login") return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="text-5xl">🚫</div>
        <div className="text-xl font-bold text-gray-800">관리자 전용 구역입니다.</div>
        <a href="/login" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">로그인하러 가기</a>
      </div>
  );
  if (authStatus === "fail") return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="text-5xl mb-4">🚨</div>
        <h2 className="text-2xl font-black text-red-600 mb-6">접근 거부: 관리자가 아닙니다!</h2>
        <a href="/" className="bg-gray-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition">메인 화면으로 가기</a>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* 🌟 좌측 관리자 메뉴바 (탭 기능 추가) */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 text-2xl font-black tracking-wider border-b border-zinc-800">
          히트팡피싱 <span className="text-sm font-normal text-blue-400 block mt-1">관리자 시스템</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-4 py-3 rounded-lg font-bold transition ${activeTab === "products" ? "bg-blue-600" : "text-gray-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            📦 상품 관리
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-lg font-bold transition flex justify-between items-center ${activeTab === "orders" ? "bg-blue-600" : "text-gray-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            <span>🚚 주문/배송 관리</span>
            {orders.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <a href="/" className="block text-center text-sm text-gray-400 hover:text-white transition">쇼핑몰 메인으로</a>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* ================= 1. 상품 관리 탭 ================= */}
        {activeTab === "products" && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">상품 관리</h1>
              <p className="text-gray-500 mt-2">쇼핑몰에 판매할 상품을 등록하고 관리합니다.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 상품 등록 (기존과 동일) */}
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">✨ 신상품 등록</h2>
                <form className="space-y-4" onSubmit={handleAddProduct}>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">카테고리</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600"><option>낚싯대</option><option>릴</option><option>루어/채비</option><option>낚시줄</option><option>태클박스/소품</option></select></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">상품명</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">판매 가격</label><input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">이미지 (URL)</label><input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600" /></div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">상품 등록하기</button>
                </form>
              </div>

              {/* 상품 목록 (기존과 동일) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">📋 등록된 상품 목록</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-gray-50 text-gray-600 text-sm border-b"><th className="p-3">카테고리</th><th className="p-3">상품명</th><th className="p-3">가격</th></tr></thead>
                    <tbody>
                      {products.map((product, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50"><td className="p-3 text-xs text-blue-600 font-bold">{product.category}</td><td className="p-3 text-sm">{product.name}</td><td className="p-3 font-bold text-red-600">{product.price}원</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. 주문/배송 관리 탭 ================= */}
        {activeTab === "orders" && (
          <div>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">주문/배송 관리</h1>
              <p className="text-gray-500 mt-2">고객들의 주문 내역을 확인하고 배송 상태를 변경할 수 있습니다.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                      <th className="p-4 font-semibold w-24">주문번호</th>
                      <th className="p-4 font-semibold w-40">주문일시</th>
                      <th className="p-4 font-semibold w-48">주문자 이메일</th>
                      <th className="p-4 font-semibold">주문 상품 요약</th>
                      <th className="p-4 font-semibold w-32">결제 금액</th>
                      <th className="p-4 font-semibold w-40">상태 변경</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-gray-400">아직 접수된 주문이 없습니다.</td></tr>
                    ) : (
                      orders.map((order, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="p-4 font-bold text-gray-400">#{order.id}</td>
                          <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleString()}</td>
                          <td className="p-4 font-semibold text-blue-600">{order.user_email}</td>
                          <td className="p-4">
                            <div className="font-bold text-gray-800">
                              {order.items[0]?.name} {order.items.length > 1 ? `외 ${order.items.length - 1}건` : ""}
                            </div>
                          </td>
                          <td className="p-4 font-black text-red-600">{order.total_amount?.toLocaleString()}원</td>
                          <td className="p-4">
                            {/* 🌟 여기서 배송 상태를 바꿉니다! */}
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`border rounded px-2 py-1 font-bold outline-none cursor-pointer
                                ${order.status === '결제완료' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                  order.status === '배송준비중' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                  order.status === '배송중' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                  'bg-green-50 text-green-700 border-green-200'}`}
                            >
                              <option value="결제완료">결제완료</option>
                              <option value="배송준비중">배송준비중</option>
                              <option value="배송중">배송중</option>
                              <option value="배송완료">배송완료</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}