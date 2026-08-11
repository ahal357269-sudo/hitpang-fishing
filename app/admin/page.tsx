"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 1. 사장님의 진짜 주소와 키 (그대로 유지)
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  
  const [category, setCategory] = useState("릴");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // 2. 수파베이스 장부에서 상품 가져오기 (정렬 조건 삭제 완료!)
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*"); // 👈 말썽을 피우던 .order("id", ...) 정렬 코드를 삭제했습니다!
    
    if (error) {
      alert("앗, 목록을 불러오지 못했습니다: " + error.message);
    }
    
    if (data) {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 3. 상품 등록 기능
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from("products")
      .insert([
        { category: category, name: name, price: price, image_url: imageUrl }
      ]);

    if (error) {
      alert("앗, 등록 중 에러가 났습니다: " + error.message);
    } else {
      alert("신상품이 DB 장부에 성공적으로 등록되었습니다! 🎉");
      setName("");
      setPrice("");
      setImageUrl("");
      fetchProducts(); 
    }
  };

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
          
          {/* 상품 등록 폼 */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">✨ 신상품 등록</h2>
            <form className="space-y-4" onSubmit={handleAddProduct}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">상품 카테고리</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>낚싯대</option>
                  <option>릴</option>
                  <option>루어/채비</option>
                  <option>낚시줄</option>
                  <option>태클박스/소품</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">상품명</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 시마노 스텔라 SW" 
                  required 
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">판매 가격 (원)</label>
                <input 
                  type="text" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="예: 1,250,000" 
                  required 
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">상품 이미지 (URL)</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..." 
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition mt-4">
                상품 등록하기
              </button>
            </form>
          </div>

          {/* 등록된 상품 목록 */}
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
                      <td colSpan={3} className="p-8 text-center text-gray-400">
                        아직 등록된 상품이 없습니다. 왼쪽에서 첫 상품을 등록해 보세요!
                      </td>
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