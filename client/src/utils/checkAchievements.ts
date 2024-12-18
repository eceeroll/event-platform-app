import achievements from "../achievements";
export interface Achievement {
  id: number;
  title: string;
  description: string;
}

export const checkAchievements = (
  points: number,
  joinedEventCount: number,
  createdEventCount: number
): Achievement[] => {
  const achieved: Achievement[] = [];

  // Katıldığı etkinlik sayısına göre başarımlar
  if (joinedEventCount >= 1)
    achieved.push(achievements.find((a) => a.id === 1)!); // Buralarda Yeniyim
  if (joinedEventCount >= 10)
    achieved.push(achievements.find((a) => a.id === 3)!); // Etkinlik Canavarı

  // Oluşturduğu etkinlik sayısına göre başarımlar
  if (createdEventCount >= 1)
    achieved.push(achievements.find((a) => a.id === 7)!); // İlk Etkinliğim

  // Puanına göre başarımlar
  if (points >= 50) achieved.push(achievements.find((a) => a.id === 9)!); // Daha Çok Puan
  if (points >= 200) achieved.push(achievements.find((a) => a.id === 10)!); // Puan Canavarı

  return achieved;
};
