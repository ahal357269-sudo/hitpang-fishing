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
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("로그인이 필요한 페이지입니다.");
        router.push("/login");
        return;
      }
      
      // 저장해둔 이름을 불러옵니다. 없으면 이메일 앞부분을 씁니다.
      const name = session.user.user_metadata?.name || session.user.email?.split('@')[0];
      setUserName(name);
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* 1. 상단 심플 헤더 (메인으로 돌아가기 용도) */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-blue-600 font-bold">🏠 홈</a>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900">마이페이지</span>
        </div>
      </header>

      {/* 2. 메인 레이아웃 (좌측 메뉴 + 우측 컨텐츠) */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* ================= 좌측 사이드바 메뉴 ================= */}
        <aside className="w-full md:w-56 flex-shrink-0">
          
          {/* 기획전 메뉴 */}
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

          {/* 마이페이지 세부 메뉴들 */}
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2 flex justify-between">
                주문관리 <span className="text-gray-400">^</span>
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-black cursor-pointer font-semibold">주문/배송 조회</li>
                <li className="hover:text-black cursor-pointer">취소/교환/반품 내역</li>
                <li className="hover:text-black cursor-pointer">이전 주문 내역</li>
                <li className="text-blue-600 hover:underline cursor-pointer mt-2">A/S 센터</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2 flex justify-between">
                쇼핑 통장관리 <span className="text-gray-400">^</span>
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-black cursor-pointer">적립금 관리</li>
                <li className="hover:text-black cursor-pointer">쿠폰 조회</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2 flex justify-between">
                활동관리 <span className="text-gray-400">^</span>
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-black cursor-pointer">회원 등급별 혜택</li>
                <li className="hover:text-black cursor-pointer">위시리스트</li>
                <li className="hover:text-black cursor-pointer">최근 본 상품</li>
                <li className="hover:text-black cursor-pointer">나의 상품평</li>
                <li className="hover:text-black cursor-pointer">상품문의</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* ================= 우측 메인 컨텐츠 ================= */}
        <div className="flex-1">
          
          {/* 상단 요약 현황판 (사진 참고) */}
          <div className="border border-gray-200 flex flex-col lg:flex-row mb-10">
            {/* 등급 영역 */}
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

            {/* 주문/쿠폰/적립금 영역 */}
            <div className="flex-1 flex items-center justify-around p-8 bg-white">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                </div>
                <span className="text-gray-500 text-sm">주문·배송</span>
                <span className="text-3xl font-light">0</span>
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

          {/* 배송 현황 플로우 */}
          <div className="border border-gray-200 p-8 mb-12 flex justify-between items-center relative">
            {/* 진행 단계 */}
            <div className="flex-1 flex justify-between px-4 z-10">
              {['입금대기', '결제완료', '배송준비중', '배송중', '배송완료'].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center bg-white px-2">
                  <div className="w-12 h-12 mb-3 text-blue-900 flex items-center justify-center border-2 border-blue-900 rounded-lg shadow-sm">
                    {/* 아이콘 대체용 (실제로는 이미지나 SVG 적용) */}
                    <span className="text-xl font-black">{idx + 1}</span>
                  </div>
                  <span className="text-gray-700 font-bold mb-1">{step}</span>
                  <span className="text-gray-500 text-sm">0건</span>
                </div>
              ))}
            </div>
            {/* 뒷배경 선 */}
            <div className="absolute top-14 left-16 right-[30%] h-0.5 bg-gray-200 z-0"></div>

            {/* 취소/교환/반품 우측 박스 */}
            <div className="border-l border-gray-200 pl-8 ml-4 min-w-[120px]">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between"><span>✕ 취소</span> <span className="font-bold">0건</span></li>
                <li className="flex justify-between"><span>⇄ 교환</span> <span className="font-bold">0건</span></li>
                <li className="flex justify-between"><span>↺ 반품</span> <span className="font-bold">0건</span></li>
              </ul>
            </div>
          </div>

          {/* 최근 주문 내역 */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xl font-bold text-gray-800">최근 주문내역</h3>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">회원등급과 적립금은 구매확정을 눌러주시면 적용됩니다.</p>
                <p className="text-xs text-gray-500">주문내역 수정을 원하시는 경우 전체 취소 후 장바구니에서 복구된 내역을 수정해 다시 주문해주시기 바랍니다. <button className="border border-gray-300 px-2 py-0.5 ml-1 hover:bg-gray-50 text-black">전체보기</button></p>
              </div>
            </div>

            {/* 네이버페이 안내 띠배너 */}
            <div className="bg-[#00c73c] text-white text-sm text-right py-2 px-4 mb-4">
              * 네이버페이로 주문한 주문건은 [네이버 &gt; 네이버페이 &gt; 결제내역]에서 확인 가능하십니다.
            </div>

            {/* 내역 리스트 (데이터 없음) */}
            <div className="border-t-2 border-b border-gray-800 py-24 text-center text-gray-500 text-sm bg-gray-50/50">
              주문 조회내역이 없습니다.
            </div>
          </div>

        </div>

        {/* ================= 우측 플로팅 배너 (최근 본 상품) ================= */}
        <div className="hidden xl:block fixed right-10 top-32 w-24 border border-gray-200 bg-white shadow-sm text-center">
          <div className="p-2 border-b border-gray-200">
            <p className="text-xs text-gray-500 mb-1">최근 본 상품</p>
            <p className="font-bold text-red-500">0</p>
          </div>
          <div className="p-4 text-xs text-gray-400 py-10">
            최근에 본 상품이<br/>없습니다.
          </div>
          <div className="p-2 border-t border-gray-200 flex justify-center">
             <button className="border border-gray-300 p-1 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
             </button>
          </div>
        </div>

      </main>
    </div>
  );
}