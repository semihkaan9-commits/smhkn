import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UserRole, AnyUser, Villager } from '../types';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AnyUser) => void;
  onRegister: (user: AnyUser) => void;
  villagers: Villager[];
  guests: AnyUser[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, villagers, guests }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [registerType, setRegisterType] = useState<UserRole.GUEST | UserRole.VILLAGER>(UserRole.GUEST);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  // const [username, setUsername] = useState(''); // Removed separate username state
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');

  // Villager Specific
  const [nickname, setNickname] = useState('');
  const [profession, setProfession] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    // setUsername(''); 
    setPassword(''); setName(''); setSurname('');
    setEmail(''); setNickname(''); setProfession(''); setAddress(''); setContact('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Lütfen e-posta ve şifrenizi giriniz.");
      return;
    }

    setIsLoading(true);
    console.log('Login attempt for:', email.trim());

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log('Login Response:', { data, error });

      if (error) throw error;

      if (data.user) {
        toast.success("Giriş başarılı!");
        // We don't call onClose() or onLogin() here manually
        // because App.tsx onAuthStateChange will handle it faster
        resetForm();
      }

    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error(`Giriş başarısız: ${error.message}`);
      setIsLoading(false); // Only stop loading if error, otherwise App.tsx unmounts us
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      toast.error("Lütfen isim, soyisim, e-posta ve şifre alanlarını doldurunuz.");
      return;
    }

    // Villager Specific Validation
    if (registerType === UserRole.VILLAGER) {
      if (!profession.trim() || !contact.trim() || !address.trim()) {
        toast.error("Köy sakini kaydı için Meslek, İletişim ve Adres alanları zorunludur.");
        return;
      }
    }

    try {
      // 1. Sign Up in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: `${name} ${surname}`,
            role: registerType
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. If Villager, insert into villagers table
        if (registerType === UserRole.VILLAGER) {
          const { error: villagerError } = await supabase.from('villagers').insert({
            user_id: authData.user.id,
            name,
            surname,
            nickname,
            profession,
            address,
            contact,
            email,
            rating: 0
          });

          if (villagerError) {
            console.error('Error creating villager profile:', villagerError);
            toast.error('Kullanıcı oluşturuldu fakat profil detayları kaydedilemedi.');
            // Optional: Delete user to maintain consistency?
          }
        }

        toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
        resetForm();
        onClose();
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Kayıt başarısız: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6 border-b border-gray-100 pb-4">
            <button
              className={`px-6 py-2 font-semibold transition-colors ${mode === 'LOGIN' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
              onClick={() => setMode('LOGIN')}
            >
              Giriş Yap
            </button>
            <button
              className={`px-6 py-2 font-semibold transition-colors ${mode === 'REGISTER' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
              onClick={() => setMode('REGISTER')}
            >
              Kayıt Ol
            </button>
          </div>

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-4">

                {/* Simplified Login Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-Posta</label>
                    <input
                      type="email" // Explicitly valid HTML5 email input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ad@ornek.com"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Şifre</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white text-black"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-6 flex justify-center items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Giriş Yapılıyor...
                  </>
                ) : 'Giriş Yap'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kayıt Türü</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${registerType === UserRole.GUEST ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setRegisterType(UserRole.GUEST)}
                  >
                    Misafir
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${registerType === UserRole.VILLAGER ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setRegisterType(UserRole.VILLAGER)}
                  >
                    Köy Sakini
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">İsim</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Soyisim</label>
                  <input type="text" value={surname} onChange={e => setSurname(e.target.value)} className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">E-Posta</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Şifre</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors" />
              </div>

              {registerType === UserRole.VILLAGER && (
                <div className="space-y-4 pt-2 animate-fade-in-up">
                  <div className="bg-green-50 p-4 rounded-lg space-y-3 border border-green-100">
                    <h4 className="font-semibold text-green-800 text-sm">Köy Sakini Bilgileri</h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-500">Meslek (Örn: Tesisatçı, Çiftçi)</label>
                      <input type="text" value={profession} onChange={e => setProfession(e.target.value)} className="w-full bg-white text-black rounded border border-gray-200 p-2 text-sm mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500">Lakap (Varsa)</label>
                        <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} className="w-full bg-white text-black rounded border border-gray-200 p-2 text-sm mt-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500">İletişim (Tel)</label>
                        <input type="tel" value={contact} onChange={e => setContact(e.target.value)} className="w-full bg-white text-black rounded border border-gray-200 p-2 text-sm mt-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500">Adres</label>
                      <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full bg-white text-black rounded border border-gray-200 p-2 text-sm mt-1" />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                Kayıt Ol
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};