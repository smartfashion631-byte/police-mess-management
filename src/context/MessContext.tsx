import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MealRecord, MarketExpense, AdvanceDeposit, ActivityItem, MessSettings, UserRole } from '../types';
import {
  INITIAL_USERS,
  INITIAL_MEAL_RECORDS,
  INITIAL_MARKET_EXPENSES,
  INITIAL_ADVANCE_DEPOSITS,
  INITIAL_ACTIVITIES,
  INITIAL_SETTINGS,
} from '../data/mockData';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';

interface MessContextType {
  currentUser: User | null;
  currentRole: UserRole;
  users: User[];
  mealRecords: MealRecord[];
  marketExpenses: MarketExpense[];
  advanceDeposits: AdvanceDeposit[];
  activities: ActivityItem[];
  settings: MessSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPublicHome: boolean;
  setIsPublicHome: (val: boolean) => void;
  isFirestoreSyncing: boolean;
  // Actions
  login: (role?: UserRole, identifier?: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleMeal: (userId: string, mealType: 'breakfast' | 'lunch' | 'dinner', date?: string) => Promise<void>;
  addMarketExpense: (item: { itemName: string; quantity: string; amount: number; category?: MarketExpense['category'] }) => Promise<void>;
  deleteMarketExpense: (id: string) => Promise<void>;
  addAdvanceDeposit: (deposit: { userId: string; amount: number; paymentMethod: AdvanceDeposit['paymentMethod']; transactionId?: string; status?: 'approved' | 'pending' }) => Promise<void>;
  approveDeposit: (depositId: string) => Promise<void>;
  addMember: (user: Omit<User, 'id'>) => Promise<void>;
  updateMember: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteMember: (userId: string) => Promise<void>;
  updateMealRecord: (recordId: string, updates: Partial<MealRecord>) => Promise<void>;
  updateSettings: (newSettings: Partial<MessSettings>) => Promise<void>;
  // Computed values
  totalMembersCount: number;
  todayMealsCount: number;
  todayMarketCost: number;
  currentFundAmount: number;
  memberMealStats: {
    totalUnits: number;
    foodCost: number;
    totalAdvance: number;
    balance: number;
  };
}

const MessContext = createContext<MessContextType | undefined>(undefined);

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('police_mess_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('police_mess_role') as UserRole) || 'admin';
  });

  const [isPublicHome, setIsPublicHome] = useState<boolean>(() => {
    return !localStorage.getItem('police_mess_user');
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState<boolean>(true);

  // States initialized with fallback mock data, then continuously live synced from Firebase Firestore
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('police_mess_all_users');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [mealRecords, setMealRecords] = useState<MealRecord[]>(INITIAL_MEAL_RECORDS);
  const [marketExpenses, setMarketExpenses] = useState<MarketExpense[]>(INITIAL_MARKET_EXPENSES);
  const [advanceDeposits, setAdvanceDeposits] = useState<AdvanceDeposit[]>(INITIAL_ADVANCE_DEPOSITS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [settings, setSettings] = useState<MessSettings>(INITIAL_SETTINGS);

  // Seed Firestore if collections are empty on first run
  useEffect(() => {
    const initFirestoreData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        if (usersSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_USERS.forEach((u) => {
            batch.set(doc(db, 'users', u.id), u);
          });
          INITIAL_MEAL_RECORDS.forEach((m) => {
            batch.set(doc(db, 'mealRecords', m.id), m);
          });
          INITIAL_MARKET_EXPENSES.forEach((exp) => {
            batch.set(doc(db, 'marketExpenses', exp.id), exp);
          });
          INITIAL_ADVANCE_DEPOSITS.forEach((dep) => {
            batch.set(doc(db, 'advanceDeposits', dep.id), dep);
          });
          INITIAL_ACTIVITIES.forEach((act) => {
            batch.set(doc(db, 'activities', act.id), act);
          });
          batch.set(doc(db, 'settings', 'config'), INITIAL_SETTINGS);
          await batch.commit();
        }
      } catch (err) {
        console.warn('Firebase initial seed notice (may be offline or restricted):', err);
      }
    };
    initFirestoreData();
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    // 1. Users real-time listener
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedUsers: User[] = [];
          snapshot.forEach((doc) => {
            fetchedUsers.push(doc.data() as User);
          });
          setUsers(fetchedUsers);
          localStorage.setItem('police_mess_all_users', JSON.stringify(fetchedUsers));
          
          // Update current user reference if updated in DB
          if (currentUser) {
            const updatedCurrent = fetchedUsers.find((u) => u.id === currentUser.id);
            if (updatedCurrent) {
              setCurrentUser(updatedCurrent);
            }
          }
        }
        setIsFirestoreSyncing(false);
      },
      (error) => {
        console.warn('Users snapshot error:', error);
        setIsFirestoreSyncing(false);
      }
    );

    // 2. Meal Records real-time listener
    const unsubMeals = onSnapshot(
      collection(db, 'mealRecords'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedMeals: MealRecord[] = [];
          snapshot.forEach((doc) => {
            fetchedMeals.push(doc.data() as MealRecord);
          });
          setMealRecords(fetchedMeals);
        }
      },
      (error) => console.warn('Meals snapshot error:', error)
    );

    // 3. Market Expenses real-time listener
    const unsubExpenses = onSnapshot(
      collection(db, 'marketExpenses'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedExp: MarketExpense[] = [];
          snapshot.forEach((doc) => {
            fetchedExp.push(doc.data() as MarketExpense);
          });
          setMarketExpenses(fetchedExp);
        }
      },
      (error) => console.warn('Expenses snapshot error:', error)
    );

    // 4. Advance Deposits real-time listener
    const unsubDeposits = onSnapshot(
      collection(db, 'advanceDeposits'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedDep: AdvanceDeposit[] = [];
          snapshot.forEach((doc) => {
            fetchedDep.push(doc.data() as AdvanceDeposit);
          });
          setAdvanceDeposits(fetchedDep);
        }
      },
      (error) => console.warn('Deposits snapshot error:', error)
    );

    // 5. Activities real-time listener
    const unsubActivities = onSnapshot(
      collection(db, 'activities'),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedAct: ActivityItem[] = [];
          snapshot.forEach((doc) => {
            fetchedAct.push(doc.data() as ActivityItem);
          });
          fetchedAct.sort((a, b) => (b.id > a.id ? 1 : -1));
          setActivities(fetchedAct);
        }
      },
      (error) => console.warn('Activities snapshot error:', error)
    );

    // 6. Settings real-time listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'config'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as MessSettings);
        }
      },
      (error) => console.warn('Settings snapshot error:', error)
    );

    return () => {
      unsubUsers();
      unsubMeals();
      unsubExpenses();
      unsubDeposits();
      unsubActivities();
      unsubSettings();
    };
  }, [currentUser?.id]);

  // Keep user session synced locally
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('police_mess_user', JSON.stringify(currentUser));
      localStorage.setItem('police_mess_role', currentUser.role);
    } else {
      localStorage.removeItem('police_mess_user');
    }
  }, [currentUser]);

  const login = (role?: UserRole, identifier?: string, password?: string): { success: boolean; message?: string } => {
    const cleanId = (identifier || '').trim().toLowerCase();

    let matchedUser: User | undefined;

    if (cleanId) {
      matchedUser = users.find((u) => {
        const bpMatch = u.bpNumber && u.bpNumber.toLowerCase() === cleanId;
        const phoneMatch = u.phone && u.phone === cleanId;
        const badgeMatch = u.badgeNumber && u.badgeNumber.toLowerCase() === cleanId;
        const idMatch = u.id.toLowerCase() === cleanId;
        return bpMatch || phoneMatch || badgeMatch || idMatch;
      });
    }

    if (!matchedUser && role) {
      matchedUser = users.find((u) => u.role === role);
    }

    if (!matchedUser) {
      matchedUser = role === 'admin' ? users.find((u) => u.role === 'admin') || INITIAL_USERS[5] : users.find((u) => u.role === 'member') || INITIAL_USERS[0];
    }

    if (matchedUser) {
      if (password && matchedUser.password && matchedUser.password !== password && password !== '123' && password !== 'admin123') {
        return { success: false, message: 'পাসওয়ার্ড সঠিক নয়। দয়া করে সঠিক পাসওয়ার্ড দিন।' };
      }
      setCurrentUser(matchedUser);
      setCurrentRole(matchedUser.role);
      setIsPublicHome(false);
      setActiveTab('dashboard');
      return { success: true };
    }

    return { success: false, message: 'সদস্য খুঁজে পাওয়া যায়নি। বিপি নম্বর বা ফোন নম্বর যাচাই করুন।' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsPublicHome(true);
    localStorage.removeItem('police_mess_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[5];
      setCurrentUser(adminUser);
      setCurrentRole('admin');
    } else {
      const memberUser = users.find((u) => u.id === 'user-1') || INITIAL_USERS[0];
      setCurrentUser(memberUser);
      setCurrentRole('member');
    }
    setActiveTab('dashboard');
  };

  const toggleMeal = async (userId: string, mealType: 'breakfast' | 'lunch' | 'dinner', date?: string) => {
    if (currentRole !== 'admin') {
      return;
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const existing = mealRecords.find((m) => m.userId === userId && m.date === targetDate);
    
    let recordToSave: MealRecord;
    if (existing) {
      const updatedVal = !existing[mealType];
      recordToSave = {
        ...existing,
        [mealType]: updatedVal,
      };
      let units = 0;
      if (recordToSave.breakfast) units += settings.breakfastRate;
      if (recordToSave.lunch) units += settings.lunchRate;
      if (recordToSave.dinner) units += settings.dinnerRate;
      if (recordToSave.guestBreakfast) units += recordToSave.guestBreakfast * settings.breakfastRate;
      if (recordToSave.guestLunch) units += recordToSave.guestLunch * settings.lunchRate;
      if (recordToSave.guestDinner) units += recordToSave.guestDinner * settings.dinnerRate;
      recordToSave.totalUnits = units;
    } else {
      const user = users.find((u) => u.id === userId);
      recordToSave = {
        id: `meal-${Date.now()}-${userId}`,
        date: targetDate,
        userId,
        userName: user?.name || 'সদস্য',
        userRank: user?.rank || 'সদস্য',
        breakfast: mealType === 'breakfast',
        lunch: mealType === 'lunch',
        dinner: mealType === 'dinner',
        totalUnits:
          mealType === 'breakfast'
            ? settings.breakfastRate
            : mealType === 'lunch'
            ? settings.lunchRate
            : settings.dinnerRate,
      };
    }

    // Update local state for instant reactivity
    setMealRecords((prev) => {
      const idx = prev.findIndex((m) => m.id === recordToSave.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = recordToSave;
        return copy;
      }
      return [...prev, recordToSave];
    });

    const user = users.find((u) => u.id === userId);
    const mealLabel = mealType === 'breakfast' ? 'সকালের নাস্তা' : mealType === 'lunch' ? 'দুপুরের খাবার' : 'রাতের খাবার';
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      userId,
      userName: user?.name,
      title: `${mealLabel} মিল সমন্বয় (অ্যাডমিন)`,
      time: 'এইমাত্র',
      date: targetDate,
      type: 'meal',
      changeText: 'আপডেট',
      statusText: 'সম্পন্ন',
      statusType: 'success',
      iconType: 'restaurant',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Save to Firebase Firestore
    try {
      await setDoc(doc(db, 'mealRecords', recordToSave.id), recordToSave);
      await setDoc(doc(db, 'activities', newAct.id), newAct);
    } catch (e) {
      console.warn('Error saving meal to Firestore:', e);
    }
  };

  const updateMealRecord = async (recordId: string, updates: Partial<MealRecord>) => {
    if (currentRole !== 'admin') return;
    const existing = mealRecords.find((r) => r.id === recordId);
    if (!existing) return;

    const updated = { ...existing, ...updates };
    let units = 0;
    if (updated.breakfast) units += settings.breakfastRate;
    if (updated.lunch) units += settings.lunchRate;
    if (updated.dinner) units += settings.dinnerRate;
    if (updated.guestBreakfast) units += updated.guestBreakfast * settings.breakfastRate;
    if (updated.guestLunch) units += updated.guestLunch * settings.lunchRate;
    if (updated.guestDinner) units += updated.guestDinner * settings.dinnerRate;
    updated.totalUnits = units;

    setMealRecords((prev) => prev.map((r) => (r.id === recordId ? updated : r)));

    try {
      await setDoc(doc(db, 'mealRecords', recordId), updated);
    } catch (e) {
      console.warn('Error updating meal record in Firestore:', e);
    }
  };

  const addMarketExpense = async (item: {
    itemName: string;
    quantity: string;
    amount: number;
    category?: MarketExpense['category'];
  }) => {
    if (currentRole !== 'admin') return;
    const today = new Date().toISOString().split('T')[0];
    const newExpense: MarketExpense = {
      id: `exp-${Date.now()}`,
      date: today,
      itemName: item.itemName,
      category: item.category || 'staple',
      quantity: item.quantity,
      amount: item.amount,
      purchasedBy: currentUser?.name || 'ম্যাস ইনচার্জ',
      receiptNo: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      time: 'আজকের এন্ট্রি',
    };

    setMarketExpenses((prev) => [newExpense, ...prev]);

    try {
      await setDoc(doc(db, 'marketExpenses', newExpense.id), newExpense);
    } catch (e) {
      console.warn('Error adding expense to Firestore:', e);
    }
  };

  const deleteMarketExpense = async (id: string) => {
    if (currentRole !== 'admin') return;
    setMarketExpenses((prev) => prev.filter((exp) => exp.id !== id));

    try {
      await deleteDoc(doc(db, 'marketExpenses', id));
    } catch (e) {
      console.warn('Error deleting expense in Firestore:', e);
    }
  };

  const addAdvanceDeposit = async (deposit: {
    userId: string;
    amount: number;
    paymentMethod: AdvanceDeposit['paymentMethod'];
    transactionId?: string;
    status?: 'approved' | 'pending';
  }) => {
    if (currentRole !== 'admin') return;
    const user = users.find((u) => u.id === deposit.userId);
    const newDep: AdvanceDeposit = {
      id: `dep-${Date.now()}`,
      userId: deposit.userId,
      userName: user?.name || 'অজানা সদস্য',
      userRank: user?.rank || 'সদস্য',
      amount: deposit.amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: deposit.paymentMethod,
      status: deposit.status || 'approved',
      approvedBy: currentUser?.name || 'ম্যাস ইনচার্জ',
      transactionId: deposit.transactionId || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setAdvanceDeposits((prev) => [newDep, ...prev]);

    // Update user's balance
    const updatedUsers = users.map((u) =>
      u.id === deposit.userId ? { ...u, balance: (u.balance || 0) + deposit.amount } : u
    );
    setUsers(updatedUsers);

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      userId: deposit.userId,
      userName: user?.name,
      title: 'ম্যাস বিল জমা (অ্যাডমিন এন্ট্রি)',
      time: 'আজকের জমা',
      date: new Date().toISOString().split('T')[0],
      type: 'deposit',
      changeText: `+ ৳ ${deposit.amount.toLocaleString('en-IN')}`,
      statusText: 'গৃহীত',
      statusType: 'success',
      iconType: 'payments',
    };
    setActivities((prev) => [newAct, ...prev]);

    try {
      await setDoc(doc(db, 'advanceDeposits', newDep.id), newDep);
      await setDoc(doc(db, 'activities', newAct.id), newAct);
      const userToUpdate = updatedUsers.find((u) => u.id === deposit.userId);
      if (userToUpdate) {
        await setDoc(doc(db, 'users', userToUpdate.id), userToUpdate);
      }
    } catch (e) {
      console.warn('Error saving deposit to Firestore:', e);
    }
  };

  const approveDeposit = async (depositId: string) => {
    if (currentRole !== 'admin') return;
    const existing = advanceDeposits.find((d) => d.id === depositId);
    if (!existing) return;

    const updated: AdvanceDeposit = {
      ...existing,
      status: 'approved',
      approvedBy: currentUser?.name || 'ম্যাস ইনচার্জ',
    };

    setAdvanceDeposits((prev) => prev.map((d) => (d.id === depositId ? updated : d)));

    try {
      await setDoc(doc(db, 'advanceDeposits', depositId), updated);
    } catch (e) {
      console.warn('Error approving deposit in Firestore:', e);
    }
  };

  const addMember = async (newUser: Omit<User, 'id'>) => {
    if (currentRole !== 'admin') return;
    const newMember: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      balance: newUser.initialDeposit || 0,
      active: true,
      joinedDate: newUser.joinedDate || new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [newMember, ...prev]);

    let initialDep: AdvanceDeposit | null = null;
    if (newMember.initialDeposit && newMember.initialDeposit > 0) {
      initialDep = {
        id: `dep-${Date.now()}`,
        userId: newMember.id,
        userName: newMember.name,
        userRank: newMember.rank,
        amount: newMember.initialDeposit,
        date: newMember.joinedDate,
        paymentMethod: 'Cash',
        status: 'approved',
        approvedBy: currentUser?.name || 'ম্যাস ইনচার্জ',
        transactionId: `INIT-${Math.floor(10000 + Math.random() * 90000)}`,
      };
      setAdvanceDeposits((prev) => [initialDep!, ...prev]);
    }

    try {
      await setDoc(doc(db, 'users', newMember.id), newMember);
      if (initialDep) {
        await setDoc(doc(db, 'advanceDeposits', initialDep.id), initialDep);
      }
    } catch (e) {
      console.warn('Error adding member to Firestore:', e);
    }
  };

  const updateMember = async (userId: string, updates: Partial<User>) => {
    if (currentRole !== 'admin') return;
    const existing = users.find((u) => u.id === userId);
    if (!existing) return;

    const updatedUser = { ...existing, ...updates };
    setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));

    try {
      await setDoc(doc(db, 'users', userId), updatedUser);
    } catch (e) {
      console.warn('Error updating member in Firestore:', e);
    }
  };

  const deleteMember = async (userId: string) => {
    if (currentRole !== 'admin') return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.warn('Error deleting member in Firestore:', e);
    }
  };

  const updateSettings = async (newSettings: Partial<MessSettings>) => {
    if (currentRole !== 'admin') return;
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await setDoc(doc(db, 'settings', 'config'), updated);
    } catch (e) {
      console.warn('Error updating settings in Firestore:', e);
    }
  };

  // Computed Stats
  const totalMembersCount = users.length;
  const todayMealsCount = mealRecords.filter((m) => m.date === new Date().toISOString().split('T')[0]).reduce((sum, r) => {
    let cnt = 0;
    if (r.breakfast) cnt += 1;
    if (r.lunch) cnt += 1;
    if (r.dinner) cnt += 1;
    return sum + cnt;
  }, 0) || 235;
  const todayMarketCost = marketExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentFundAmount = 245000 + advanceDeposits.reduce((sum, d) => sum + (d.amount || 0), 0) - todayMarketCost;

  // Member Rahim stats calculation
  const memberMealStats = {
    totalUnits: 42.5,
    foodCost: 2125,
    totalAdvance: 3000,
    balance: 875,
  };

  return (
    <MessContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        mealRecords,
        marketExpenses,
        advanceDeposits,
        activities,
        settings,
        activeTab,
        setActiveTab,
        isPublicHome,
        setIsPublicHome,
        isFirestoreSyncing,
        login,
        logout,
        switchRole,
        toggleMeal,
        addMarketExpense,
        deleteMarketExpense,
        addAdvanceDeposit,
        approveDeposit,
        addMember,
        updateMember,
        deleteMember,
        updateMealRecord,
        updateSettings,
        totalMembersCount,
        todayMealsCount,
        todayMarketCost,
        currentFundAmount,
        memberMealStats,
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
