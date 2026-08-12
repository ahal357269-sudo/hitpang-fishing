"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://dsnxztxebcotganfqrlf.supabase.co";
const supabaseKey = "sb_publishable_kPRuJ1MnftzY9ZFw1kAp6Q_lwi-GZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignupPage() {
  const router = useRouter();

  // 입력 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // 🌟 배송지 주소 상태 관리
  const [zonecode, setZonecode] = useState(""); // 우편번호
  const [address, setAddress] = useState(""); // 기본주소
  const [detailAddress, setDetailAddress] = useState(""); // 상세주소

  const [isLoading, setIsLoading] = useState(false);

  // 🌟 카카오(다음) 우편번호 스크립트 불러오기
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 🌟 우편번호 찾기 팝업 띄우기
  const handleOpenPostcode = () => {
    if ((window as any).daum && (window as any).daum.Postcode) {
      new (window as any).daum.Postcode({
        oncomplete: function (data: any) {
          setZonecode(data.zonecode); // 우편번호 셋팅
          setAddress(data.address); // 기본주소 셋팅
          // 상세주소 입력창으로 포커스 이동을 위해 잠시 대기
          setTimeout(() => {
            document.getElementById("detailAddress")?.focus();
          }, 100);
        },
      }).open();
    } else {
      alert("주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  // 회원가입 처리
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !passwordConfirm || !name || !phone || !zonecode || !address || !detailAddress) {
      alert("모든 필수 항목을 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 수파베이스 회원가입 요청 (주소 정보도 user_metadata에 함께 저장!)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            phone: phone,
            zonecode: zonecode,
            address: address,
            detail_address: detailAddress,
          },
        },
      });

      if (error) throw error;

      alert("🎉 회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (error: any) {
      alert("회원가입 실패: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <a href="/" className="text-3xl font-black text-blue-600 tracking-tighter cursor-pointer">
          HITPANG<span className="text-gray-800">FISHING</span>
        </a>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
          회원가입
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            
            {/* 1. 이메일 (아이디) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이메일 (아이디)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="예: hitpang@naver.com"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {/* 2. 비밀번호 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자리 이상"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 재입력"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* 3. 이름 & 연락처 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="숫자만 입력 (- 제외)"
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* 🌟 4. 배송지 주소 (핵심 추가 영역) */}
            <div className="space-y-3 pt-2 border-t border-gray-100 mt-6">
              <label className="block text-sm font-bold text-gray-700">기본 배송지</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zonecode}
                  readOnly
                  placeholder="우편번호"
                  className="w-1/3 border border-gray-300 rounded-lg p-3 outline-none bg-gray-100 text-gray-600 font-bold"
                />
                <button
                  type="button"
                  onClick={handleOpenPostcode}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg px-4 py-3 transition"
                >
                  우편번호 찾기
                </button>
              </div>

              <input
                type="text"
                value={address}
                readOnly
                placeholder="기본 주소 (우편번호 검색 시 자동 입력)"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none bg-gray-100 text-gray-600 font-bold"
              />

              <input
                id="detailAddress"
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소를 입력해주세요 (동, 호수 등)"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {/* 회원가입 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white transition ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "가입 처리 중..." : "가입 완료하기"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">이미 계정이 있으신가요? </span>
            <a href="/login" className="font-bold text-blue-600 hover:text-blue-800 transition">
              로그인하기
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}