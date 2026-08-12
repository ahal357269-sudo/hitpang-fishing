"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

// 🚨 사장님의 진짜 이메일 주소를 완벽하게 장착했습니다!
const ADMIN_EMAIL = "swn1212@naver.com"; 

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("릴");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [authStatus, setAuthStatus] = useState("loading"); // loading, no_login, fail, success
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
    };

    checkAdmin();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data.reverse());
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([
      { category, name, price, image_url: imageUrl }
    ]);

    if (error) alert("앗, 에러: " + error.message);
    else {
      alert("등록 완료! 🎉");
      setName(""); setPrice(""); setImageUrl("");
      fetchProducts(); 
    }
  };


  if (authStatus === "loading") {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 bg-gray-50">🔐 신원 확인 중... 자물쇠를 풀고 있습니다.</div>;
  }

  if (authStatus === "no_login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="text-5xl">🚫</div>
        <div className="text-xl font-bold text-gray-800">관리자 전용 구역입니다.</div>
        <p className="text-gray-500">먼저 사장님 계정으로 로그인해 주세요.</p>
        <a href="/login" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">로그인하러 가기</a>
      </div>
    );
  }

  if (authStatus === "fail") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="text-5xl mb-4">🚨</div>
        <h2 className="text-2xl font-black text-red-600 mb-6">접근 거부: 관리자가 아닙니다!</h2>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left max-w-md w-full">
          <p className="text-gray-500 mb-1 text-sm">현재 로그인하신 이메일</p>
          <p className="font-bold text-gray-800 text-lg mb-4">{currentEmail}</p>
          
          <p className="text-gray-500 mb-1 text-sm">코드에 적어둔 사장님 이메일</p>
          <p className="font-bold text-blue-600 text-lg">{ADMIN_EMAIL}</p>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-red-500 font-semibold">* 위 두 이메일 주소가 단 한 글자라도 다르면 자물쇠가 열리지 않습니다.</p>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <a href="/" className="bg-gray-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition">메인 화면으로 가기</a>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href='/login'; }} className="bg-white border border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition">다른 계정으로 다시 로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      <aside className="w-64 bg-zinc-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 text-2xl font-black tracking-wider border-b border-zinc-800">
          히트팡피싱 <span className="text-sm font-normal text-blue-400 block mt-1">관리자 시스템</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-3 bg-blue-600 rounded-lg font-bold">📦 상품 관리</a>
          <a href="#" className="block px-4 py-3 text-gray-400 hover:bg-zinc-800 hover:text-white rounded-lg transition">주문/배송 관리</a>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <a href="/" className="block text-center text-sm text-gray-400 hover:text-white transition">쇼핑몰 메인으로</a>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">상품 관리</h1>
          <p className="text-gray-500 mt-2">쇼핑몰에 판매할 상품을 등록하고 관리할 수 있습니다.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">✨ 신상품 등록</h2>
            <form className="space-y-4" onSubmit={handleAddProduct}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">상품 카테고리</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>낚싯대</option>
                  <option>릴</option>
                  <option>루어/채비</option>
                  <option>낚시줄</option>
                  <option>태클박스/소품</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">상품명</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 시마노 스텔라 SW" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">판매 가격 (원)</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="예: 1,250,000" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">상품 이미지 (URL)</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition mt-4">
                상품 등록하기
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">📋 등록된 상품 목록</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                    <th className="p-3 font-semibold rounded-tl-lg">카테고리</th>
                    <th className="p-3 font-semibold">상품명</th>
                    <th className="p-3 font-semibold">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400">아직 등록된 상품이 없습니다.</td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{product.category}</span></td>
                        <td className="p-3 font-medium text-gray-800">{product.name}</td>
                        <td className="p-3 text-red-600 font-bold">{product.price}원</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}