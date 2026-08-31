import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { useMess } from '../context/MessContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  onBackToHome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToHome }) => {
  const { login, setIsPublicHome } = useMess();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [identifier, setIdentifier] = useState<string>('BP-7501019920');
  const [password, setPassword] = useState<string>('123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setIdentifier('BP-7501019920');
      setPassword('123');
    } else {
      setIdentifier('BP-9204123456');
      setPassword('123');
    }
  };

  const handleSelectDemo = (bp: string, pass: string, role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(bp);
    setPassword(pass);
    setErrorMsg('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('দয়া করে আপনার বিপি নম্বর বা ফোন নম্বর প্রদান করুন');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('দয়া করে পাসওয়ার্ড প্রদান করুন');
      return;
    }

    const res = login(selectedRole, identifier, password);
    if (!res.success) {
      setErrorMsg(res.message || 'লগইন ব্যর্থ হয়েছে। বিপি নম্বর ও পাসওয়ার্ড যাচাই করুন।');
    }
  };

  const handleGoHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      setIsPublicHome(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-['Hind_Siliguri','Inter',sans-serif] text-[#0b1c30] antialiased overflow-hidden bg-[#0d1322] p-4">
      {/* Background Graphic Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-[480px]">
        {/* Back to Home Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-14 h-14 bg-[#131b2e] flex items-center justify-center rounded-2xl shadow-md border border-slate-700">
              <Shield className="w-7 h-7 text-amber-400 fill-amber-400/20" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#006c49] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                বাংলাদেশ পুলিশ লাইন্স
              </span>
              <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight mt-1">
                ম্যাস ম্যানেজমেন্ট পোর্টাল
              </h1>
              <p className="text-xs text-[#45464d] mt-0.5">
                বিপি নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
              </p>
            </div>
          </div>

          {/* Quick Demo Selector Chips */}
          <div className="bg-[#eff4ff] p-3 rounded-2xl border border-[#dce9ff] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#131b2e]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                এক ক্লিকে ডেমো লগইন:
              </span>
              <span className="text-[10px] text-[#76777d]">পাসওয়ার্ড: 123</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectDemo('BP-7501019920', '123', 'admin')}
                className={`py-1.5 px-2 rounded-xl text-left text-xs font-semibold transition-all border ${
                  selectedRole === 'admin'
                    ? 'bg-[#131b2e] text-white border-[#131b2e]'
                    : 'bg-white text-[#0b1c30] border-[#c6c6cd]/50 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>অ্যাডমিন (ইনচার্জ)</span>
                  <span className="text-[9px] opacity-75">Admin</span>
                </div>
                <div className="text-[10px] opacity-80">BP-7501019920</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('BP-9204123456', '123', 'member')}
                className={`py-1.5 px-2 rounded-xl text-left text-xs font-semibold transition-all border ${
                  selectedRole === 'member' && identifier === 'BP-9204123456'
                    ? 'bg-[#006c49] text-white border-[#006c49]'
                    : 'bg-white text-[#0b1c30] border-[#c6c6cd]/50 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>কনস্টেবল রহিম</span>
                  <span className="text-[9px] opacity-75">Member</span>
                </div>
                <div className="text-[10px] opacity-80">BP-9204123456</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#45464d]">
                আপনার পদমর্যাদা / ভূমিকা নির্বাচন করুন
              </span>
              <div className="flex gap-2 p-1 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/50">
                <button
                  type="button"
                  id="role-admin-button"
                  onClick={() => handleRoleChange('admin')}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-[#131b2e] text-white shadow-xs'
                      : 'text-[#45464d] hover:text-black'
                  }`}
                >
                  অ্যাডমিন (ম্যাস ইনচার্জ)
                </button>
                <button
                  type="button"
                  id="role-member-button"
                  onClick={() => handleRoleChange('member')}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'member'
                      ? 'bg-[#131b2e] text-white shadow-xs'
                      : 'text-[#45464d] hover:text-black'
                  }`}
                >
                  সাধারণ সদস্য
                </button>
              </div>
            </div>

            {/* BP Number / ID Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#45464d]" htmlFor="identifier">
                বিপি নম্বর (BP Number) / ফোন নম্বর
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#76777d]">
                  <KeyRound className="w-4 h-4 text-[#76777d]" />
                </span>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="যেমন: BP-7501019920 বা 01712345678"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#131b2e] focus:border-transparent transition-all placeholder:text-[#76777d]/60"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#45464d]" htmlFor="password">
                  পাসওয়ার্ড
                </label>
                <span className="text-[11px] text-[#76777d]">
                  ইনচার্জ প্রদত্ত পাসওয়ার্ড
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#76777d]">
                  <Lock className="w-4 h-4 text-[#76777d]" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#131b2e] focus:border-transparent transition-all placeholder:text-[#76777d]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#76777d] hover:text-[#0b1c30] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-button"
              className="w-full mt-2 bg-[#131b2e] hover:bg-black text-white py-3.5 px-6 rounded-xl text-sm font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>পোর্টালে লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Policy Note & Footer */}
          <div className="border-t border-[#eff4ff] pt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#006c49] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>নিরাপদ পুলিশ ডাটাবেস দ্বারা সুরক্ষিত</span>
            </div>
            <p className="text-[11px] text-[#76777d]">
              কোনো সদস্য নিজে থেকে মিল বা টাকা যুক্ত করতে পারবেন না। সকল এন্ট্রি ম্যাস ইনচার্জ কর্তৃক প্রদত্ত।
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

