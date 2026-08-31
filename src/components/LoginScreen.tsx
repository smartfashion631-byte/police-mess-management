import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  onBackToHome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToHome }) => {
  const { login, setIsPublicHome } = useMess();

  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    setIdentifier('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setErrorMsg('দয়া করে আপনার বিপি নম্বর বা ফোন নম্বর প্রদান করুন');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('দয়া করে পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(
        selectedRole,
        cleanIdentifier,
        cleanPassword
      );

      if (!res.success) {
        setErrorMsg(
          res.message ||
            'লগইন ব্যর্থ হয়েছে। আপনার BP নম্বর/ফোন নম্বর এবং পাসওয়ার্ড যাচাই করুন।'
        );
      }
    } catch (error) {
      setErrorMsg('লগইন করার সময় একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
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

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[480px]">

        {/* Back to Home */}
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

          {/* Header */}
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
                আপনার BP নম্বর/ফোন নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleLogin}
          >

            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">

              <span className="text-xs font-semibold text-[#45464d]">
                আপনার পদমর্যাদা / ভূমিকা নির্বাচন করুন
              </span>

              <div className="flex gap-2 p-1 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/50">

                {/* Admin */}
                <button
                  type="button"
                  id="role-admin-button"
                  onClick={() => handleRoleChange('admin')}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-[#131b2e] text-white shadow-sm'
                      : 'text-[#45464d] hover:text-black hover:bg-white'
                  }`}
                >
                  অ্যাডমিন
                  <span className="block text-[9px] opacity-70 mt-0.5">
                    ম্যাস ইনচার্জ
                  </span>
                </button>

                {/* Member */}
                <button
                  type="button"
                  id="role-member-button"
                  onClick={() => handleRoleChange('member')}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'member'
                      ? 'bg-[#006c49] text-white shadow-sm'
                      : 'text-[#45464d] hover:text-black hover:bg-white'
                  }`}
                >
                  সাধারণ সদস্য
                  <span className="block text-[9px] opacity-70 mt-0.5">
                    Member
                  </span>
                </button>

              </div>
            </div>

            {/* BP Number / Phone */}
            <div className="flex flex-col gap-1.5">

              <label
                className="text-xs font-semibold text-[#45464d]"
                htmlFor="identifier"
              >
                বিপি নম্বর (BP Number) / ফোন নম্বর
              </label>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#76777d]">
                  <KeyRound className="w-4 h-4" />
                </span>

                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="BP নম্বর অথবা ফোন নম্বর লিখুন"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#131b2e] focus:border-transparent transition-all placeholder:text-[#76777d]/60"
                />

              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">

              <div className="flex justify-between items-center">

                <label
                  className="text-xs font-semibold text-[#45464d]"
                  htmlFor="password"
                >
                  পাসওয়ার্ড
                </label>

                <span className="text-[11px] text-[#76777d]">
                  নিরাপদ পাসওয়ার্ড ব্যবহার করুন
                </span>

              </div>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#76777d]">
                  <Lock className="w-4 h-4" />
                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#131b2e] focus:border-transparent transition-all placeholder:text-[#76777d]/60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'পাসওয়ার্ড লুকান'
                      : 'পাসওয়ার্ড দেখুন'
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#76777d] hover:text-[#0b1c30] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-button"
              disabled={isLoading}
              className="w-full mt-2 bg-[#131b2e] hover:bg-black disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl text-sm font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >

              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>পোর্টালে লগইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}

            </button>

          </form>

          {/* Security Note */}
          <div className="border-t border-[#eff4ff] pt-4 text-center space-y-2">

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#006c49] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>নিরাপদ পুলিশ ডাটাবেস দ্বারা সুরক্ষিত</span>
            </div>

            <p className="text-[11px] text-[#76777d]">
              কোনো সদস্য নিজে থেকে মিল বা টাকা যুক্ত করতে পারবেন না।
              সকল এন্ট্রি ম্যাস ইনচার্জ কর্তৃক নিয়ন্ত্রিত।
            </p>

          </div>

        </div>
      </main>
    </div>
  );
};
