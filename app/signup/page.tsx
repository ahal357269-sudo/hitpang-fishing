"use client";

export default function SignupPage() {
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert("히트팡피싱의 가족이 되신 것을 환영합니다! 🎉\n가입이 성공적으로 완료되었습니다.");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans p-4 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
        
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <a href="/" className="text-4xl font-black text-blue-600 tracking-tighter hover:text-blue-800 transition">
            히트팡피싱
          </a>
          <h1 className="text-xl font-bold text-gray-800 mt-4">회원가입</h1>
          <p className="text-gray-500 mt-2 text-sm">히트팡피싱의 가족이 되어 다양한 혜택을 누리세요!</p>
        </div>
        
        {/* 회원가입 폼 */}
        <form className="space-y-4" onSubmit={handleSignup}>
          {/* 1. 이름 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
            <input type="text" placeholder="홍길동" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>

          {/* 2. 아이디(이메일) 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">아이디 (이메일)</label>
            <input type="email" placeholder="example@hitpang.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>

          {/* 3. 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
            <input type="password" placeholder="비밀번호 (8자 이상)" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>

          {/* 4. 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호 확인</label>
            <input type="password" placeholder="비밀번호를 한번 더 입력해주세요" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>
          
          {/* 5. 주소 입력 (새로 추가된 부분입니다!) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">주소 (배송지)</label>
            {/* 기본 주소 */}
            <input type="text" placeholder="기본 주소 (예: 경기도 용인시...)" className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
            {/* 상세 주소 */}
            <input type="text" placeholder="상세 주소 (동, 호수 등)" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" />
          </div>

          {/* 6. 약관 동의 체크박스 */}
          <div className="pt-2">
            <label className="flex items-start text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" required className="mt-1 mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 shrink-0" />
              <span>[필수] 히트팡피싱 이용약관 및 개인정보 수집·이용에 동의합니다.</span>
            </label>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-md mt-6">
            가입 완료하기
          </button>
        </form>
        
        {/* 로그인 페이지로 돌아가기 */}
        <div className="mt-6 text-center text-sm text-gray-500 border-t pt-6">
          이미 계정이 있으신가요? 
          <a href="/login" className="text-blue-600 font-bold hover:underline ml-2">로그인 하기</a>
        </div>

      </div>
    </div>
  );
}