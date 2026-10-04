import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { COLORS } from '@/constants/theme';
import { storage } from '@/lib/biometrics';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export default function NutritionScreen() {
  const [logs, setLogs] = useState<FoodItem[]>([]);
  const [form, setForm] = useState({ name: '', cal: '', p: '', c: '', f: '', type: 'Breakfast' });

  const addFood = async () => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: form.name,
      calories: parseFloat(form.cal) || 0,
      protein: parseFloat(form.p) || 0,
      carbs: parseFloat(form.c) || 0,
      fats: parseFloat(form.f) || 0,
      mealType: form.type as any,
    };
    const updated = [...logs, newItem];
    setLogs(updated);
    await storage.saveFoodLog(updated);
    setForm({ name: '', cal: '', p: '', c: '', f: '', type: 'Breakfast' });
  };

  const deleteFood = async (id: string) => {
    const updated = logs.filter(i => i.id !== id);
    setLogs(updated);
    await storage.saveFoodLog(updated);
  };

  const totals = logs.reduce((acc, curr) => ({
    cal: acc.cal + curr.calories,
    p: acc.p + curr.protein,
    c: acc.c + curr.carbs,
    f: acc.f + curr.fats,
  }), { cal: 0, p: 0, c: 0, f: 0 });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color: COLORS.text.primary, marginBottom: 20 }}>Nutrition Log</Text>

      {/* Manual Entry Form */}
      <View style={{ backgroundColor: COLORS.surface, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 }}>
        <TextInput
          placeholder="Food Name"
          placeholderTextColor="#71717a"
          style={{ color: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: 10, marginBottom: 10 }}
          value={form.name}
          onChangeText={t => setForm({...form, name: t})}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput placeholder="Cal" placeholderTextColor="#71717a" style={{ flex: 1, color: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: 10 }} value={form.cal} onChangeText={t => setForm({...form, cal: t})} keyboardType="numeric" />
          <TextInput placeholder="Prot" placeholderTextColor="#71717a" style={{ flex: 1, color: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: 10 }} value={form.p} onChangeText={t => setForm({...form, p: t})} keyboardType="numeric" />
          <TextInput placeholder="Carbs" placeholderTextColor="#71717a" style={{ flex: 1, color: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: 10 }} value={form.c} onChangeText={t => setForm({...form, c: t})} keyboardType="numeric" />
          <TextInput placeholder="Fats" placeholderTextColor="#71717a" style={{ flex: 1, color: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: 10 }} value={form.f} onChangeText={t => setForm({...form, f: t})} keyboardType="numeric" />
        </View>
        <TouchableOpacity onPress={addFood} style={{ backgroundColor: COLORS.brand.cyan, padding: 12, borderRadius: 12, marginTop: 15, alignItems: 'center' }}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Add Food Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Totals Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: COLORS.text.secondary, fontSize: 12 }}>Calories</Text>
          <Text style={{ color: COLORS.brand.cyan, fontSize: 20, fontWeight: 'bold' }}>{totals.cal}</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: COLORS.text.secondary, fontSize: 12 }}>Protein</Text>
          <Text style={{ color: COLORS.brand.emerald, fontSize: 20, fontWeight: 'bold' }}>{totals.p}g</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: COLORS.text.secondary, fontSize: 12 }}>Carbs</Text>
          <Text style={{ color: COLORS.brand.amber, fontSize: 20, fontWeight: 'bold' }}>{totals.c}g</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: COLORS.text.secondary, fontSize: 12 }}>Fats</Text>
          <Text style={{ color: COLORS.brand.coral, fontSize: 20, fontWeight: 'bold' }}>{totals.f}g</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: COLORS.text.muted, fontSize: 12 }}>{item.calories} kcal | P:{item.protein} C:{item.carbs} F:{item.fats}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteFood(item.id)}>
              <Text style={{ color: COLORS.brand.coral }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}
