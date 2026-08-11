export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
        
        {/* 로고 및 환영 인사 */}
        <div className="text-center mb-8">
          <a href="/" className="text-4xl font-black text-blue-600 tracking-tighter hover:text-blue-800 transition">
            히트팡피싱
          </a>
          <p className="text-gray-500 mt-3 text-sm">프리미엄 낚시 쇼핑몰에 오신 것을 환영합니다.</p>
        </div>
        
        {/* 로그인 폼 */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">아이디 (이메일)</label>
            <input 
              type="email" 
              placeholder="example@hitpang.com" 
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
            <input 
              type="password" 
              placeholder="비밀번호를 입력해주세요" 
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" 
            />
          </div>
          
          {/* 자동 로그인 & 비밀번호 찾기 */}
          <div className="flex justify-between items-center text-sm mt-2">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input type="checkbox" className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300" />
              로그인 상태 유지
            </label>
            <a href="#" className="text-gray-500 hover:text-blue-600">비밀번호 찾기</a>
          </div>
          
          <button className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition shadow-md mt-6">
            로그인
          </button>
        </form>
        
        {/* 회원가입 유도 */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
          아직 히트팡피싱 회원이 아니신가요? <br className="md:hidden" />
          <a href="/signup" className="text-blue-600 font-bold hover:underline ml-1">회원가입 하기</a>
        </div>

      </div>
    </div>
  );
}