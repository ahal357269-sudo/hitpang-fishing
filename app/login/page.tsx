"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 수파베이스 장부 및 금고 연결!
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // 페이지 이동 도구

  // '로그인' 버튼을 눌렀을 때 실행되는 코드
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 수파베이스 금고에서 이메일과 비밀번호가 맞는지 확인합니다.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("앗, 로그인에 실패했습니다: 아이디나 비밀번호를 다시 확인해 주세요!");
    } else {
      alert("로그인 성공! 환영합니다. 🎉");
      // 로그인 성공 시 쇼핑몰 메인 화면으로 이동합니다.
      router.push("/"); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <h2 className="text-xl font-bold text-gray-800 mt-4">로그인</h2>
          <p className="text-gray-500 text-sm mt-2">다시 오신 것을 환영합니다!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">이메일 (아이디)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="가입하신 이메일을 입력하세요" 
              required 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요" 
              required 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition" 
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-2 shadow-sm">
            로그인하기
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          아직 계정이 없으신가요? <a href="/signup" className="text-blue-600 font-bold hover:underline">회원가입하기</a>
        </div>

      </div>
    </div>
  );
}