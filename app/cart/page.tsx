export default function CartPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-4 md:p-10 max-w-6xl mx-auto">
      
      {/* 간이 헤더 (메인으로 돌아가기) */}
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <a href="/" className="text-2xl font-black text-blue-600 hover:text-blue-800">
          히트팡피싱
        </a>
        <h1 className="text-2xl font-bold">장바구니</h1>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        {/* 왼쪽: 장바구니에 담긴 상품 목록 */}
        <div className="flex-1">
          <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-4 shadow-sm">
            {/* 방금 등록하신 사장님의 사진이 들어갈 자리입니다 */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
               <img src="/item1.jpg" alt="상품" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">이그지스트(EXIST) 2026 신형 스피닝릴</h3>
              <p className="text-sm text-gray-500 mt-1">옵션: 2500S-DH / 수량: 1개</p>
            </div>
            
            <div className="font-bold text-xl text-gray-900">980,000원</div>
            <button className="text-gray-400 hover:text-red-500 ml-4 font-bold text-xl transition">
              ✕
            </button>
          </div>
          
          <button className="text-sm text-gray-500 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 mt-2">
            선택 상품 삭제
          </button>
        </div>

        {/* 오른쪽: 최종 결제 금액 요약 박스 */}
        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 h-fit border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-800">결제 예정 금액</h2>
          
          <div className="flex justify-between mb-3 text-gray-600">
            <span>총 상품 금액</span>
            <span className="font-semibold text-gray-800">980,000원</span>
          </div>
          <div className="flex justify-between mb-6 text-gray-600">
            <span>배송비</span>
            <span className="font-semibold text-gray-800">0원 (무료배송)</span>
          </div>
          
          <hr className="border-gray-200 mb-6" />
          
          <div className="flex justify-between font-bold text-2xl text-red-600 mb-8">
            <span>총 결제 금액</span>
            <span>980,000원</span>
          </div>
          
          <button className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-md">
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}