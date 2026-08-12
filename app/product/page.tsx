"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductDetailPage() {
  const params = useParams(); 
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);

  // 🌟 리뷰 관련 상태 모음
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5); // 기본 별점 5점!

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!params?.id) return;
      
      // 1. 상품 정보 가져오기
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (productData) setProduct(productData);

      // 2. 이 상품에 달린 리뷰들만 가져오기
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", params.id)
        .order("created_at", { ascending: false });

      if (reviewData) setReviews(reviewData);

      // 3. 로그인 상태 확인 (리뷰 작성용)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);

      setIsLoading(false);
    };

    fetchProductAndReviews();
  }, [params]);

  const addToCart = () => {
    if (!product) return;
    try {
      const existingCart = localStorage.getItem("hitpang_cart");
      let cartArray = existingCart ? JSON.parse(existingCart) : [];
      if (!Array.isArray(cartArray)) cartArray = [];

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

  // 🌟 리뷰 등록 마법 함수!
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인 후 리뷰를 작성할 수 있습니다!");
      return;
    }
    if (newReview.trim() === "") {
      alert("리뷰 내용을 입력해 주세요.");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      { 
        product_id: params?.id, 
        user_email: user.email, 
        rating: rating,
        content: newReview 
      }
    ]);

    if (error) {
      alert("리뷰 등록 중 에러가 발생했습니다: " + error.message);
    } else {
      alert("소중한 리뷰가 등록되었습니다! 🎉");
      setNewReview("");
      setRating(5);
      
      // 리뷰 목록 새로고침
      const { data: updatedReviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", params?.id)
        .order("created_at", { ascending: false });
      if (updatedReviews) setReviews(updatedReviews);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">상품 정보를 불러오는 중입니다...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">삭제되거나 존재하지 않는 상품입니다.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <a href="/cart" className="text-sm font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1">
            장바구니 🛒
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 상단: 상품 상세 정보 (기존과 동일) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-10 mb-10">
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">이미지 준비중</span>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <span className="text-sm font-bold text-blue-600 mb-2">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="border-b border-gray-100 pb-6 mb-6 flex items-center gap-4">
              <div>
                <span className="text-4xl font-black text-red-600">{product.price}</span>
                <span className="text-xl font-medium text-gray-900 ml-1">원</span>
              </div>
              {reviews.length > 0 && (
                <span className="text-sm text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded">
                  ★ 리뷰 {reviews.length}개
                </span>
              )}
            </div>

            <div className="space-y-4 text-sm text-gray-600 mb-8 bg-gray-50 p-6 rounded-xl">
              <div className="flex"><span className="w-24 font-bold text-gray-500">배송방법</span> <span>택배</span></div>
              <div className="flex"><span className="w-24 font-bold text-gray-500">배송비</span> <span>3,000원 (50,000원 이상 무료배송)</span></div>
              <div className="flex"><span className="w-24 font-bold text-gray-500">원산지</span> <span>상품상세 참조</span></div>
            </div>

            <div className="flex items-center justify-between mb-8 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-700">구매 수량</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition">-</button>
                <span className="px-6 py-2 font-bold border-l border-r border-gray-300 w-16 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition">+</button>
              </div>
            </div>

            <div className="flex space-x-3 mt-auto">
              <button onClick={addToCart} className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold py-4 rounded-xl text-lg hover:bg-blue-50 transition">
                장바구니 담기
              </button>
              <button onClick={addToCart} className="flex-1 bg-blue-600 border-2 border-blue-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 transition shadow-lg">
                바로 구매하기
              </button>
            </div>
          </div>
        </div>

        {/* 하단 탭 메뉴 */}
        <div className="flex border-b border-gray-200 font-bold text-gray-500 text-lg mb-8">
          <div className="flex-1 text-center py-4 hover:text-blue-600 cursor-pointer transition">상세정보</div>
          <div className="flex-1 text-center py-4 border-b-2 border-blue-600 text-blue-600 transition">상품평 ({reviews.length})</div>
          <div className="flex-1 text-center py-4 hover:text-blue-600 cursor-pointer transition">상품문의</div>
        </div>

        {/* 🌟 찐 단골을 만드는 리뷰 게시판 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">상품 후기 <span className="text-blue-600 text-lg ml-2">{reviews.length}건</span></h2>
          
          {/* 리뷰 작성 폼 */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">상품은 만족하셨나요?</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <textarea 
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="다른 고객님들을 위해 생생한 후기를 남겨주세요!" 
                    className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-600 outline-none"
                    rows={3}
                    required
                  ></textarea>
                  <button type="submit" className="bg-blue-600 text-white font-bold px-6 rounded-lg hover:bg-blue-700 transition">
                    리뷰<br/>등록
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-3 font-semibold">리뷰를 작성하려면 로그인이 필요합니다.</p>
                <a href="/login" className="inline-block bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition">로그인 하기</a>
              </div>
            )}
          </div>

          {/* 리뷰 목록 뿌려주기 */}
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <span className="text-4xl mb-4 block">📝</span>
                <p>아직 등록된 후기가 없습니다. 첫 번째 리뷰어가 되어주세요!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-lg">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                      <span className="text-sm font-bold text-gray-800 ml-2">{review.user_email?.split('@')[0]}***</span>
                      <span className="text-xs text-gray-400">| {new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}