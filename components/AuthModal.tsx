import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UserRole, AnyUser, Villager } from '../types';
import { X } from 'lucide-react';

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
  const [loginType, setLoginType] = useState<UserRole.VILLAGER | UserRole.GUEST | UserRole.ADMIN>(UserRole.VILLAGER);

  // Form States
  const [username, setUsername] = useState(''); // For Admin
  const [password, setPassword] = useState(''); // For Admin
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');

  // Villager Specific
  const [nickname, setNickname] = useState('');
  const [profession, setProfession] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername(''); setPassword(''); setName(''); setSurname('');
    setEmail(''); setNickname(''); setProfession(''); setAddress(''); setContact('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Admin Check
    if (username === 'admin') {
      if (password === '123') {
        onLogin({ id: 'admin', name: 'Sistem', surname: 'Yöneticisi', role: UserRole.ADMIN });
        resetForm();
        onClose();
        return;
      } else {
        toast.error("Yönetici şifresi yanlış!");
        return;
      }
    }

    // Regular Login Validation
    if (!name.trim() || !surname.trim()) {
      toast.error("Giriş yapmak için İsim ve Soyisim alanlarını doldurmalısınız.");
      return;
    }



    // Determine Role based on Radio Selection
    const role = loginType === UserRole.ADMIN ? UserRole.ADMIN : (loginType === UserRole.VILLAGER ? UserRole.VILLAGER : UserRole.GUEST);

    if (role === UserRole.VILLAGER) {
      // Normalize input for case-insensitive comparison
      const inputName = name.trim().toLocaleLowerCase('tr-TR');
      const inputSurname = surname.trim().toLocaleLowerCase('tr-TR');

      // Find villager
      const foundVillager = villagers.find(v =>
        v.name.toLocaleLowerCase('tr-TR') === inputName &&
        v.surname.toLocaleLowerCase('tr-TR') === inputSurname
      );

      if (foundVillager) {
        onLogin(foundVillager);
      } else {
        toast.error("Böyle bir köy sakini bulunamadı. Lütfen isminizi ve soyisminizi doğru girdiğinizden emin olun veya yeni kayıt oluşturun.", {
          duration: 5000,
        });
        return;
      }
    } else {
      // Guest Login Validation
      const inputName = name.trim().toLocaleLowerCase('tr-TR');
      const inputSurname = surname.trim().toLocaleLowerCase('tr-TR');

      const foundGuest = guests.find(g =>
        g.name.toLocaleLowerCase('tr-TR') === inputName &&
        g.surname.toLocaleLowerCase('tr-TR') === inputSurname
      );

      if (foundGuest) {
        onLogin(foundGuest);
      } else {
        toast.error("Misafir kaydınız bulunamadı. Lütfen önce kayıt olun.", {
          duration: 5000,
        });
        return;
      }
    }
    resetForm();
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!name.trim() || !surname.trim() || !email.trim()) {
      toast.error("Lütfen isim, soyisim ve e-posta alanlarını doldurunuz.");
      return;
    }

    // Villager Specific Validation
    if (registerType === UserRole.VILLAGER) {
      if (!profession.trim() || !contact.trim() || !address.trim()) {
        toast.error("Köy sakini kaydı için Meslek, İletişim ve Adres alanları zorunludur.");
        return;
      }
    }

    const baseUser = {
      id: Date.now().toString(),
      name,
      surname,
      email
    };

    if (registerType === UserRole.GUEST) {
      onRegister({ ...baseUser, role: UserRole.GUEST });
    } else {
      const newVillager: Villager = {
        ...baseUser,
        role: UserRole.VILLAGER,
        nickname,
        profession,
        address,
        contact,
        rating: 0 // Initialize rating
      };
      onRegister(newVillager);
    }
    resetForm();
    onClose();
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giriş Türü</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="loginType"
                        checked={loginType === UserRole.VILLAGER}
                        onChange={() => {
                          setLoginType(UserRole.VILLAGER);
                          if (username === 'admin') {
                            setUsername('');
                            setName('');
                          }
                          setPassword('');
                          setSurname('');
                        }}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>Köylü</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="loginType"
                        checked={loginType === UserRole.GUEST}
                        onChange={() => {
                          setLoginType(UserRole.GUEST);
                          if (username === 'admin') {
                            setUsername('');
                            setName('');
                          }
                          setPassword('');
                          setSurname('');
                        }}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>Misafir</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="loginType"
                        checked={loginType === UserRole.ADMIN}
                        onChange={() => {
                          setLoginType(UserRole.ADMIN);
                          setUsername('admin');
                          setPassword(''); // Optional: clear password when switching TO admin too
                          setSurname('');
                        }}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span>Yönetici</span>
                    </label>
                  </div>
                </div>

                {/* Standard Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={username || name}
                      onChange={e => {
                        const val = e.target.value;
                        if (loginType !== UserRole.ADMIN && val.toLowerCase() === 'admin') {
                          toast.error("Kullanıcı adı olarak 'admin' kullanılamaz!");
                          return;
                        }
                        setName(val);
                        setUsername(val);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Şifre</label>
                    <input
                      type={username === 'admin' ? 'password' : 'text'}
                      value={password || surname}
                      onChange={e => { setSurname(e.target.value); setPassword(e.target.value); }}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white text-black"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-6">
                Giriş Yap
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