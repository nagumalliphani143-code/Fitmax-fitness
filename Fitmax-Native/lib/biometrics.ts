import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'New User',
  age: 25,
  height: 170,
  weight: 70,
  gender: 'male',
  activityLevel: 'moderately_active',
};

export const calculateBMR = (profile: UserProfile) => {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'female') {
    return 447.593 + (// corrected: usually 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
      (9.247 * weight) + (3.098 * height) - (4.330 * age)
    );
  }
  return 655 + (9.563 * weight) + (1.85 * height) - (4.676 * age);
};

export const getTDEEMultiplier = (level: UserProfile['activityLevel']) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  return multipliers[level];
};

export const storage = {
  async saveProfile(profile: UserProfile) {
    await AsyncStorage.setItem('fitmax_profile', JSON.stringify(profile));
  },
  async getProfile(): Promise<UserProfile> {
    const data = await AsyncStorage.getItem('fitmax_profile');
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  },
  async saveFoodLog(log: any[]) {
    await AsyncStorage.setItem('fitmax_food_log', JSON.stringify(log));
  },
  async getFoodLog(): Promise<any[]> {
    const data = await AsyncStorage.getItem('fitmax_food_log');
    return data ? JSON.parse(data) : [];
  }
};
