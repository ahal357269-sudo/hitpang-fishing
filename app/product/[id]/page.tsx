"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

// 수파베이스 연결
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductDetailPage() {
  const params = useParams(); // 주소창의 [id] 값을 가져오는 도구
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // 구매 수량

  useEffect(() => {
    // 🌟 수파베이스에서 주소창의 id 번호와 똑같은 상품 1개만 딱 가져옵니다!
    const fetchProduct = async () => {
      if (!params?.id) return;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) setProduct(data);
      setIsLoading(false);
    };

    fetchProduct();
  }, [params]);

  // 🌟 상세페이지에서 장바구니 담기
  const addToCart = () => {
    if (!product) return;
    try {
      const existingCart = localStorage.getItem("hitpang_cart");
      let cartArray = existingCart ? JSON.parse(existingCart) : [];
      if (!Array.isArray(cartArray)) cartArray = [];

      // 수량만큼 장바구니에 넣기
      for (let i = 0; i < quantity; i++) {
        cartArray.push(product);
      }
      
      localStorage.setItem("hitpang_cart", JSON.stringify(cartArray));
      
      if (confirm("장바구니에 담겼습니다! 장바구니로 이동하시겠습니까? 🛒")) {
        router.push("/cart");
      }
    } catch (error) {
      alert("앗, 장바구니에 담는 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">상품 정보를 불러오는 중입니다...</div>;
  
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">삭제되거나 존재하지 않는 상품입니다.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-20">
      
      {/* 심플 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <a href="/cart" className="text-sm font-bold text-gray-600 hover:text-blue-600">장바구니 가기</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 상단: 상품 사진 & 요약 정보 */}
        <div className="flex flex-col md:flex-row gap-10 mb-20">
          
          {/* 좌측: 상품 이미지 */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">이미지 준비중</span>
              )}
            </div>
          </div>

          {/* 우측: 상품 결제 및 설명 */}
          <div className="w-full md:w-1/2 flex flex-col">
            <span className="text-sm font-bold text-blue-600 mb-2">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="border-b border-gray-200 pb-6 mb-6">
              <span className="text-4xl font-black text-red-600">{product.price}</span>
              <span className="text-xl font-medium text-gray-900 ml-1">원</span>
            </div>

            <div className="space-y-4 text-sm text-gray-600 mb-8">
              <div className="flex"><span className="w-24 text-gray-400">배송방법</span> <span>택배</span></div>
              <div className="flex"><span className="w-24 text-gray-400">배송비</span> <span>3,000원 (50,000원 이상 무료배송)</span></div>
              <div className="flex"><span className="w-24 text-gray-400">원산지</span> <span>상품상세 참조</span></div>
            </div>

            {/* 수량 선택기 */}
            <div className="flex items-center space-x-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <span className="font-bold text-gray-700">수량</span>
              <div className="flex items-center border border-gray-300 rounded bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100">-</button>
                <span className="px-4 py-1 font-bold border-l border-r border-gray-300">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100">+</button>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex space-x-2 mt-auto">
              <button onClick={addToCart} className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold py-4 rounded-xl text-lg hover:bg-blue-50 transition">
                장바구니 담기
              </button>
              <button onClick={addToCart} className="flex-1 bg-blue-600 border-2 border-blue-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 transition shadow-lg">
                바로 구매하기
              </button>
            </div>
          </div>
        </div>

        {/* 하단: 탭 메뉴 & 긴 상품 설명 (디자인용) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="flex border-b border-gray-200 bg-gray-50 text-center font-bold text-gray-600">
            <div className="flex-1 py-4 border-b-2 border-blue-600 text-blue-600 bg-white">상세정보</div>
            <div className="flex-1 py-4 border-l border-gray-200 hover:bg-white cursor-pointer">상품평 (0)</div>
            <div className="flex-1 py-4 border-l border-gray-200 hover:bg-white cursor-pointer">상품문의</div>
            <div className="flex-1 py-4 border-l border-gray-200 hover:bg-white cursor-pointer">배송/교환/반품</div>
          </div>
          
          <div className="p-20 text-center flex flex-col items-center justify-center">
             <h2 className="text-2xl font-black text-gray-800 mb-4">프리미엄 피싱 기어, {product.name}</h2>
             <p className="text-gray-500 mb-10 leading-relaxed max-w-2xl">
               어떤 환경에서도 최고의 퍼포먼스를 자랑하는 최신형 제품입니다. <br/>
               가벼운 무게와 극대화된 내구성으로 당신의 런커 도전을 완벽하게 지원합니다.
             </p>
             {/* 임시 상세페이지 이미지 */}
             <div className="w-full max-w-4xl h-96 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-zinc-500 font-bold text-xl">상세 이미지 준비중</span>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}