export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* 1. 최상단 유틸리티 메뉴 (여기 회원가입 주소를 "/signup"으로 연결했습니다!) */}
      <div className="bg-gray-100 py-2 text-xs text-gray-500 flex justify-end px-4 md:px-10 space-x-4">
        <a href="/login" className="hover:text-gray-900">로그인</a>
        <a href="/signup" className="hover:text-gray-900 font-bold text-blue-600">회원가입</a>
        <a href="/cart" className="hover:text-gray-900">장바구니</a>
        <a href="#" className="hover:text-gray-900">고객센터</a>
      </div>

      {/* 2. 헤더 영역 */}
      <header className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-6">
        <a href="/" className="text-4xl font-black tracking-tighter text-blue-600 mb-4 md:mb-0 cursor-pointer">
          히트팡피싱
        </a>
        <div className="flex w-full md:w-1/2 max-w-2xl border-2 border-blue-600 rounded-full overflow-hidden focus-within:ring-2 ring-blue-300 transition">
          <input 
            type="text" 
            placeholder="검색어를 입력하세요 (예: 시마노 릴, 합사줄)" 
            className="w-full px-5 py-3 outline-none text-sm font-medium" 
          />
          <button className="bg-blue-600 text-white px-8 py-3 font-bold hover:bg-blue-700 transition">
            검색
          </button>
        </div>
      </header>

      {/* 3. 메인 카테고리 */}
      <nav className="flex justify-center space-x-6 md:space-x-12 py-4 font-bold text-gray-800 border-t border-b border-gray-200">
        <a href="#" className="hover:text-blue-600 transition">낚싯대</a>
        <a href="#" className="hover:text-blue-600 transition">릴</a>
        <a href="#" className="hover:text-blue-600 transition">루어/채비</a>
        <a href="#" className="hover:text-blue-600 transition">낚시줄</a>
        <a href="#" className="hover:text-blue-600 transition">태클박스/소품</a>
      </nav>

      {/* 4. 메인 배너 및 상품 진열 영역 */}
      <main className="px-4 md:px-10 py-8 max-w-7xl mx-auto flex-1 w-full">
        <div className="bg-blue-50 rounded-xl p-10 md:p-20 text-center mb-12 border border-blue-100 shadow-sm">
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-4">2026 시즌 ON! 봄맞이 특가전</h2>
          <p className="text-lg text-gray-600 mb-8">히트팡피싱에서 준비한 완벽한 출조, 지금 바로 확인하세요.</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
            기획전 상품 보기
          </button>
        </div>

        {/* 베스트 상품 진열장 */}
        <div>
          <h3 className="text-2xl font-bold mb-6">🏆 이번 주 베스트 상품</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            
            {/* 상품 카드 1 */}
            <a href="/product" className="group cursor-pointer block">
              <div className="bg-gray-100 aspect-square rounded-lg mb-3 overflow-hidden">
                <img src="/item1.jpg" alt="릴" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-xs text-gray-500 mb-1">다이와 (DAIWA)</div>
              <div className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">이그지스트(EXIST) 2026 신형 스피닝릴</div>
              <div className="font-bold text-lg text-red-600">980,000<span className="text-sm font-normal text-gray-800">원</span></div>
            </a>

            {/* 상품 카드 2 */}
            <div className="group cursor-pointer">
              <div className="bg-gray-100 aspect-square rounded-lg mb-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1516956737008-db28919a3bfa?q=80&w=500&auto=format&fit=crop" alt="낚싯대" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-xs text-gray-500 mb-1">시마노 (SHIMANO)</div>
              <div className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">스텔라 SW 바다낚시용 릴</div>
              <div className="font-bold text-lg text-red-600">1,250,000<span className="text-sm font-normal text-gray-800">원</span></div>
            </div>

            {/* 상품 카드 3 */}
            <div className="group cursor-pointer">
              <div className="bg-gray-100 aspect-square rounded-lg mb-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=500&auto=format&fit=crop" alt="채비" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-xs text-gray-500 mb-1">히트팡 자체제작</div>
              <div className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">히트팡 프리미엄 8합사 에깅줄 150m</div>
              <div className="font-bold text-lg text-red-600">18,500<span className="text-sm font-normal text-gray-800">원</span></div>
            </div>

            {/* 상품 카드 4 */}
            <div className="group cursor-pointer">
              <div className="bg-gray-100 aspect-square rounded-lg mb-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551221763-718dae6f2122?q=80&w=500&auto=format&fit=crop" alt="태클박스" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-xs text-gray-500 mb-1">메이호 (MEIHO)</div>
              <div className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">BM-9000 대용량 태클박스 하드케이스</div>
              <div className="font-bold text-lg text-red-600">65,000<span className="text-sm font-normal text-gray-800">원</span></div>
            </div>

          </div>
        </div>
      </main>

      {/* 5. 새롭게 추가된 하단 회사 정보 (Footer) */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-black text-white mb-4 tracking-wider">히트팡피싱</h2>
            <div className="space-y-2 text-sm">
              <p>상호명: 히트팡피싱 | 대표: OOO</p>
              <p>사업자등록번호: 000-00-00000 | 통신판매업신고: 제2026-용인-0000호</p>
              <p>주소: 경기도 용인시 (상세주소 입력)</p>
              <p>도메인: www.hitpang.com</p>
            </div>
          </div>
          <div className="md:text-right">
            <h3 className="text-white font-bold mb-4">고객센터</h3>
            <p className="text-3xl font-bold text-white mb-2">1588-0000</p>
            <p className="text-sm">평일 09:00 - 18:00 (점심시간 12:00 - 13:00)</p>
            <p className="text-sm">주말 및 공휴일 휴무</p>
          </div>
        </div>
      </footer>
    </div>
  );
}