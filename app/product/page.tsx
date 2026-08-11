export default function ProductDetail() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 간이 헤더 (메인화면으로 돌아가기 용도) */}
      <header className="border-b border-gray-200 py-4 px-4 md:px-10 flex justify-between items-center">
        <a href="/" className="text-2xl font-black text-blue-600 hover:text-blue-800">
          히트팡피싱
        </a>
        <div className="text-sm text-gray-500">
          홈 &gt; 릴 &gt; 스피닝릴
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-10 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* 왼쪽: 상품 대표 이미지 */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-100 aspect-square rounded-xl overflow-hidden mb-4">
              <img 
                src="/item1.jpg" 
                alt="상품 사진" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-gray-200 aspect-square rounded-md cursor-pointer border-2 border-blue-600"></div>
              <div className="bg-gray-200 aspect-square rounded-md cursor-pointer hover:bg-gray-300"></div>
              <div className="bg-gray-200 aspect-square rounded-md cursor-pointer hover:bg-gray-300"></div>
            </div>
          </div>

          {/* 오른쪽: 상품 정보 및 결제 버튼 */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="text-sm text-gray-500 mb-2">다이와 (DAIWA)</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">이그지스트(EXIST) 2026 신형 스피닝릴</h1>
            
            <div className="flex items-end gap-2 border-b border-gray-200 pb-6 mb-6">
              <span className="text-4xl font-bold text-red-600">980,000</span>
              <span className="text-xl font-normal text-gray-800 mb-1">원</span>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">배송비</span>
                <span className="font-medium text-gray-800">3,000원 (50,000원 이상 무료)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">적립금</span>
                <span className="font-medium text-gray-800">최대 9,800원 적립</span>
              </div>
            </div>

            {/* 옵션 선택 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-800 mb-2">기어비 / 모델 선택</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">-[필수] 옵션을 선택해 주세요-</option>
                <option value="1">2500S-DH (재고: 5개)</option>
                <option value="2">C3000 (재고: 품절)</option>
                <option value="3">4000-CXH (재고: 12개)</option>
              </select>
            </div>

            {/* 구매 버튼 */}
            <div className="flex gap-4 mt-auto">
              {/* 장바구니 버튼을 링크로 변경하여 연결 완료! */}
              <a href="/cart" className="flex-1 text-center border-2 border-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-50 transition">
                장바구니
              </a>
              <button className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition">
                바로 구매
              </button>
            </div>
          </div>
        </div>

        {/* 상품 하단 상세 설명 영역 */}
        <div className="mt-20 border-t border-gray-200 pt-10 text-center">
          <h2 className="text-2xl font-bold mb-10">상품 상세 정보</h2>
          <div className="bg-gray-100 min-h-[500px] flex items-center justify-center text-gray-400 rounded-xl">
            [이곳에 길고 자세한 상품 설명 이미지가 들어갑니다]
          </div>
        </div>
      </main>
    </div>
  );
}