"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 수파베이스 연결
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MyPage() {
  const [userName, setUserName] = useState("고객");
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌟 내 주문 내역을 담을 새로운 주머니입니다!
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("로그인이 필요한 페이지입니다.");
        router.push("/login");
        return;
      }
      
      const name = session.user.user_metadata?.name || session.user.email?.split('@')[0];
      setUserName(name);

      // 🌟 내 주문 내역만 쏙 골라오기 (user_email이 내 이메일과 같은 것만!)
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", session.user.email)
        .order("created_at", { ascending: false }); // 최신 주문이 위로 오게 정렬

      if (orderData) {
        setOrders(orderData);
      }
      
      setIsLoading(false);
    };

    fetchUserAndOrders();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-blue-600 font-bold">🏠 홈</a>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900">마이페이지</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="border border-gray-300 mb-6">
            <div className="bg-zinc-800 text-white font-bold text-center py-3">
              히트팡 기획전 ▼
            </div>
            <ul className="text-sm">
              <li className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50 cursor-pointer font-bold text-red-600">★다이와 Hot 신상</li>
              <li className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50 cursor-pointer">여름철 채비도</li>
              <li className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50 cursor-pointer">에기 마켓 NEW</li>
              <li className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50 cursor-pointer">봉돌 맛집</li>
              <li className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50 cursor-pointer">낚시릴 (*사은품)</li>
              <li className="py-3 px-4 hover:bg-gray-50 cursor-pointer">가방 강력추천</li>
            </ul>
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2 flex justify-between">주문관리 <span className="text-gray-400">^</span></h3>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-black cursor-pointer font-semibold">주문/배송 조회</li>
                <li className="hover:text-black cursor-pointer">취소/교환/반품 내역</li>
                <li className="hover:text-black cursor-pointer">이전 주문 내역</li>
                <li className="text-blue-600 hover:underline cursor-pointer mt-2">A/S 센터</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2 flex justify-between">쇼핑 통장관리 <span className="text-gray-400">^</span></h3>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-black cursor-pointer">적립금 관리</li>
                <li className="hover:text-black cursor-pointer">쿠폰 조회</li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="border border-gray-200 flex flex-col lg:flex-row mb-10">
            <div className="bg-gray-100 p-8 flex flex-col items-center justify-center lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200">
              <h2 className="text-2xl font-black text-blue-900 tracking-wider mb-4">마이페이지</h2>
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-md border-2 border-yellow-400">
                일반
              </div>
              <p className="text-gray-700 text-sm text-center">
                <strong className="text-black text-base">{userName}</strong>님의 현재 등급은<br/>
                <strong className="text-blue-600">일반회원</strong>입니다.
              </p>
              <button className="mt-3 px-3 py-1 bg-white border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 rounded-sm">
                등급혜택보기
              </button>
            </div>

            <div className="flex-1 flex items-center justify-around p-8 bg-white">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                </div>
                <span className="text-gray-500 text-sm">주문·배송</span>
                {/* 🌟 0건이었던 자리에 내 주문 횟수를 띄웁니다! */}
                <span className="text-3xl font-light text-blue-600 font-bold">{orders.length}</span>
              </div>
              <div className="h-16 border-r border-gray-200"></div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>
                </div>
                <span className="text-gray-500 text-sm">보유 쿠폰</span>
                <span className="text-3xl font-light">0</span>
              </div>
              <div className="h-16 border-r border-gray-200"></div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-lime-500 text-white flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
                </div>
                <span className="text-gray-500 text-sm">적립금</span>
                <span className="text-3xl font-light">2,000</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xl font-bold text-gray-800">최근 주문내역</h3>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">회원등급과 적립금은 구매확정을 눌러주시면 적용됩니다.</p>
              </div>
            </div>

            <div className="bg-[#00c73c] text-white text-sm text-right py-2 px-4 mb-4">
              * 네이버페이로 주문한 주문건은 [네이버 &gt; 네이버페이 &gt; 결제내역]에서 확인 가능하십니다.
            </div>

            {/* 🌟 주문 내역 리스트 뿌려주기! */}
            {orders.length === 0 ? (
              <div className="border-t-2 border-b border-gray-800 py-24 text-center text-gray-500 text-sm bg-gray-50/50">
                주문 조회내역이 없습니다.
              </div>
            ) : (
              <div className="border-t-2 border-gray-800">
                {orders.map((order, orderIdx) => (
                  <div key={orderIdx} className="border-b border-gray-200 bg-white py-6 px-6 shadow-sm mb-4 mt-4 rounded-b-lg">
                    
                    {/* 주문 날짜와 상태 */}
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                      <span className="font-bold text-gray-700">
                        주문일자: {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-blue-700 font-bold bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-sm">
                        {order.status}
                      </span>
                    </div>

                    {/* 주문한 상품들 목록 */}
                    <div className="space-y-4">
                      {order.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">이미지</div>
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-blue-600">{item.category}</span>
                            <p className="font-bold text-gray-900 mt-1">{item.name}</p>
                            <p className="text-gray-500 text-sm mt-1">{item.price}원</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 총 결제 금액 */}
                    <div className="text-right mt-6 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 mr-4">총 결제금액</span>
                      <span className="text-2xl font-black text-red-600">{order.total_amount?.toLocaleString()}원</span>
                    </div>
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