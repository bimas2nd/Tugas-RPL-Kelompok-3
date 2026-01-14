import { View, Text, TextInput, Pressable, ScrollView, Image } from "react-native";
import { useState } from "react";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // nanti tinggal sambung ke API
    console.log({ nama, nik, alamat, photo });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200 mb-6">
        <Ionicons
          onPress={() => {
            router.replace("/home/setting");
          }}
          name="arrow-back"
          size={22}
          color="#111"
        />
        <Text className="ml-3 text-lg font-semibold">Settings</Text>
      </View>

      <View className="mb-4">
        <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
        <Text className="text-sm text-gray-500">Perbarui data warga</Text>
      </View>

      {/* Card */}
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="font-semibold text-gray-800 mb-4">Data Warga</Text>

        {/* Foto Profile */}
        <Pressable onPress={pickImage} className="items-center justify-center mb-6">
          <View className="w-28 h-28 rounded-full bg-gray-100 items-center justify-center overflow-hidden">
            {photo ? <Image source={{ uri: photo }} className="w-full h-full" /> : <Camera size={28} color="#6b7280" />}
          </View>
          <Text className="text-sm text-indigo-500 mt-2 font-medium">Ubah Foto Profile</Text>
        </Pressable>

        {/* Nama */}
        <Text className="text-gray-600 text-sm mb-1">Nama Lengkap</Text>
        <TextInput placeholder="Nama lengkap" value={nama} onChangeText={setNama} className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800" />

        {/* NIK */}
        <Text className="text-gray-600 text-sm mb-1">NIK</Text>
        <TextInput
          placeholder="16 digit NIK"
          keyboardType="numeric"
          maxLength={16}
          value={nik}
          onChangeText={setNik}
          className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
        />

        {/* Alamat */}
        <Text className="text-gray-600 text-sm mb-1">Alamat</Text>
        <TextInput
          placeholder="Alamat lengkap"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={alamat}
          onChangeText={setAlamat}
          className="border border-gray-200 rounded-xl px-4 py-3 h-24 text-gray-800 mb-6"
        />

        {/* Button */}
        <Pressable onPress={handleSubmit} className="bg-indigo-500 rounded-xl py-3 items-center mt-4">
          <Text className="text-white font-semibold text-base">Simpan Perubahan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
