import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { COLORS } from '@/constants/theme';
import { storage, UserProfile, calculateBMR, getTDEEMultiplier } from '@/lib/biometrics';
import { User, Ruler, Scale, Target, Save } from 'lucide-react-native';

export default function SettingsScreen() {
  const [profile, setProfile] = useState<UserProfile>(storage.DEFAULT_PROFILE);
  const [formData, setFormData] = useState<UserProfile>(storage.DEFAULT_PROFILE);

  useEffect(() => {
    async function load() {
      const saved = await storage.getProfile();
      setProfile(saved);
      setFormData(saved);
    }
    load();
  }, []);

  const handleSave = async () => {
    await storage.saveProfile(formData);
    setProfile(formData);
    Alert.alert("Success", "Biometrics updated and recalibrated.");
  };

  const bmr = calculateBMR(profile);
  const tdee = bmr * getTDEEMultiplier(profile.activityLevel);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color: COLORS.text.primary, marginBottom: 25, marginTop: 40 }}>Biometric Engine</Text>

      {/* Live Calculation Card */}
      <View style={{ backgroundColor: COLORS.surface, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, marginBottom: 25 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <Text style={{ color: COLORS.brand.cyan, fontWeight: 'bold', fontSize: 14 }}>DAILY ENERGY EXPENDITURE</Text>
          <Target size={18} color={COLORS.brand.cyan} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={{ fontSize: 36, fontWeight: '900', color: 'white' }}>{Math.round(tdee)}</Text>
          <Text style={{ color: COLORS.text.secondary, fontSize: 16 }}>kcal/day</Text>
        </View>
        <Text style={{ color: COLORS.text.muted, fontSize: 12, marginTop: 8 }}>
          Based on BMR of {Math.round(bmr)} kcal and {profile.activityLevel.replace('_', ' ')} activity level.
        </Text>
      </View>

      {/* Input Fields */}
      <View style={{ gap: 20 }}>
        <InputField
          label="Full Name"
          icon={<User size={18} color={COLORS.text.muted} />}
          value={formData.name}
          onChangeText={t => setFormData({...formData, name: t})}
        />
        <InputField
          label="Age"
          icon={<Target size={18} color={COLORS.text.muted} />}
          value={formData.age.toString()}
          onChangeText={t => setFormData({...formData, age: parseInt(t) || 0})}
          keyboard="numeric"
        />
        <InputField
          label="Height (cm)"
          icon={<Ruler size={18} color={COLORS.text.muted} />}
          value={formData.height.toString()}
          onChangeText={t => setFormData({...formData, height: parseInt(t) || 0})}
          keyboard="numeric"
        />
        <InputField
          label="Weight (kg)"
          icon={<Scale size={18} color={COLORS.text.muted} />}
          value={formData.weight.toString()}
          onChangeText={t => setFormData({...formData, weight: parseInt(t) || 0})}
          keyboard="numeric"
        />

        <View style={{ gap: 10, marginTop: 10 }}>
          <Text style={{ color: COLORS.text.secondary, fontSize: 14, fontWeight: 'bold' }}>Activity Level</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(['sedentary', 'lightly_active', 'moderately_active', 'very_active'] as const).map(level => (
              <TouchableOpacity
                key={level}
                onPress={() => setFormData({...formData, activityLevel: level})}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: formData.activityLevel === level ? COLORS.brand.cyan : COLORS.surface,
                  borderWidth: 1,
                  borderColor: formData.activityLevel === level ? COLORS.brand.cyan : COLORS.border
                }}
              >
                <Text style={{ color: formData.activityLevel === level ? 'black' : 'white', fontSize: 11, fontWeight: 'bold' }}>
                  {level.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        style={{ backgroundColor: COLORS.brand.cyan, padding: 18, borderRadius: 20, marginTop: 40, marginBottom: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}
      >
        <Save size={20} color="black" />
        <Text style={{ color: 'black', fontWeight: '900', fontSize: 16 }}>Save Biometrics</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InputField({ label, icon, value, onChangeText, keyboard = 'default' }: any) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: COLORS.text.secondary, fontSize: 14, fontWeight: 'medium' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12 }}>
        {icon}
        <TextInput
          style={{ flex: 1, color: 'white', padding: 15, fontSize: 16 }}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboard === 'numeric' ? 'numeric' : 'default'}
        />
      </View>
    </View>
  );
}
