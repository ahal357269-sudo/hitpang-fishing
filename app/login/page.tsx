"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 일반 이메일 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } else {
      router.push("/");
    }
  };

  // 🌟 카카오 & 구글 소셜 로그인 기능!
  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin, // 로그인 끝나면 메인 화면으로 돌아오기
      }
    });

    if (error) {
      alert(`${provider} 로그인 연동 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <a href="/" className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer">
          HITPANG<span className="text-gray-800">FISHING</span>
        </a>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
          로그인
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl border border-gray-100 sm:px-10">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이메일 (아이디)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입하신 이메일 입력"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white transition ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "로그인 중..." : "이메일로 로그인"}
              </button>
            </div>
          </form>

          {/* 🌟 소셜 로그인 버튼 영역 */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">또는 1초 만에 시작하기</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* 카카오 로그인 버튼 */}
              <button
                onClick={() => handleSocialLogin('kakao')}
                type="button"
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-sm text-base font-black text-[#000000] bg-[#FEE500] hover:bg-[#FFD800] transition relative"
              >
                {/* 카카오 심볼 아이콘 */}
                <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.5 2 10.82c0 2.76 1.83 5.17 4.59 6.46-.2.72-.73 2.62-.84 3.05-.13.56.26.54.54.35.21-.14 3.42-2.31 4.79-3.26.31.02.63.04.92.04 5.523 0 10-3.5 10-7.82C22 6.5 17.523 3 12 3z" />
                </svg>
                카카오로 시작하기
              </button>

              {/* 구글 로그인 버튼 */}
              <button
                onClick={() => handleSocialLogin('google')}
                type="button"
                className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-bold text-gray-700 bg-white hover:bg-gray-50 transition relative"
              >
                {/* 구글 G 아이콘 */}
                <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                구글로 시작하기
              </button>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <span className="text-gray-500 text-sm">아직 회원이 아니신가요? </span>
            <a href="/signup" className="font-bold text-blue-600 hover:text-blue-800 transition">
              회원가입하기
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}