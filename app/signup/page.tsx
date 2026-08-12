
"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 수파베이스 연결
const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignupPage() {
  // 🌟 사장님이 요청하신 모든 정보들을 담을 공간입니다!
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🌟 약관 및 수신 동의 체크박스 상태
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 필수 약관 동의 확인
    if (!agreeTerms) {
      alert("필수 이용약관에 동의해 주셔야 가입이 가능합니다.");
      return;
    }

    // 2. 비밀번호 확인
    if (password !== passwordConfirm) {
      alert("비밀번호가 서로 다릅니다. 다시 확인해 주세요!");
      return;
    }

    // 3. 수파베이스에 모든 정보 저장하기
    const { data, error } = await supabase.auth.signUp({
      email: email, // 로그인을 위한 기본 키
      password: password,
      options: {
        data: {
          username: userId,   // 아이디
          name: name,         // 이름
          phone: phone,       // 전화번호
          address: address,   // 주소
          sms_opt_in: agreeSms,     // SMS 수신여부 (true/false)
          email_opt_in: agreeEmail, // 이메일 수신여부 (true/false)
        }
      }
    });

    if (error) {
      alert("앗, 회원가입 중 에러가 발생했습니다: " + error.message);
    } else {
      alert(`${name}님 환영합니다! 회원가입이 완벽하게 완료되었습니다! 🎉`);
      router.push("/login"); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer">
            HITPANG<span className="text-gray-800">FISHING</span>
          </a>
          <h2 className="text-xl font-bold text-gray-800 mt-4">회원가입</h2>
          <p className="text-gray-500 text-sm mt-2">정확한 정보를 입력해 주시면 감사하겠습니다.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* 아이디 & 이름 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">아이디</label>
              <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="원하시는 아이디" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">이름</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 홍길동" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호 (6자리 이상)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" required minLength={6} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호 확인</label>
            <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 한 번 더 입력" required minLength={6} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          {/* 이메일 (로그인 겸용) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">이메일 (로그인 시 사용됩니다)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="예: hitpang@naver.com" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          {/* 전화번호 & 주소 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">전화번호</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="예: 010-1234-5678" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">배송 주소</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="상품을 받아보실 주소를 입력해 주세요" required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          {/* 🌟 약관 동의 구역 */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-600" />
              <span className="text-gray-800 font-bold text-sm">[필수] 이용약관 및 개인정보 수집 동의</span>
            </label>
            <div className="border-t border-gray-200 my-2"></div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={agreeSms} onChange={(e) => setAgreeSms(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-600" />
              <span className="text-gray-600 text-sm">[선택] SMS 마케팅 수신 동의</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={agreeEmail} onChange={(e) => setAgreeEmail(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-600" />
              <span className="text-gray-600 text-sm">[선택] 이메일 마케팅 수신 동의</span>
            </label>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition mt-6 shadow-sm">
            모든 정보 입력 완료 (가입하기)
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요? <a href="/login" className="text-blue-600 font-bold hover:underline">로그인하기</a>
        </div>

      </div>
    </div>
  );
}