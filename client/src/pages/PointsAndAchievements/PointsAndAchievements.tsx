import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaStar,
  FaCommentDots,
  FaMedal,
  FaHandsHelping,
} from "react-icons/fa";
import axios from "axios";
import styles from "./PointsAndAchievements.module.css";
import BackButton from "../../components/BackButton/BackButton";
import { User } from "../../types/User";
import { checkAchievements } from "../../utils/checkAchievements";
import { Achievement } from "../../utils/checkAchievements";
import achievements from "../../achievements";

const PointsAndAchievements: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [allUsersRanked, setAllUsersRanked] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await axios.get("http://localhost:3000/users/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setUserPoints(response.data.user.points);

        // Katıldıkları etkinlik sayısını al
        const joinedResponse = await axios.get(
          "http://localhost:3000/events/joined",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Oluşturdukları etkinlik sayısını al
        const createdResponse = await axios.get(
          "http://localhost:3000/events/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { points } = response.data.user;
        const { joinedEventCount } = joinedResponse.data;
        const { createdEventCount } = createdResponse.data;

        const achievements = checkAchievements(
          points,
          joinedEventCount,
          createdEventCount
        );

        setUserAchievements(achievements);

        const rankedResponse = await axios.get(
          "http://localhost:3000/users/ranking",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rankedUsers = rankedResponse.data;
        setAllUsersRanked(rankedUsers);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "An error occurred");
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  // Henüz kazanılmayan başarımlar
  const unachievedAchievements = achievements.filter(
    (achievement) =>
      !userAchievements.some(
        (userAchievement) => userAchievement.id === achievement.id
      )
  );

  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.rightColumn}>
        <div className={styles.pointsSection}>
          <h2 className={styles.header}>Puanlarım</h2>
          <div className={styles.pointsBox}>
            <FaMedal className={styles.pointsIcon} />
            <p className={styles.points}>Mevcut Puan: {userPoints}</p>
          </div>
        </div>

        <div className={styles.achievementsSection}>
          <h2 className={styles.header}>Başarımlarım</h2>
          <div className={styles.achievementsSection}>
            {userAchievements.length === 0 ? (
              <p>Henüz başarı kazanmadınız.</p>
            ) : (
              userAchievements.map((achievement) => (
                <div key={achievement.id} className={styles.achievementCard}>
                  <div className={styles.achievementBadge}>
                    <FaTrophy size={40} />
                  </div>
                  <div className={styles.achievementDetails}>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <h2 className={styles.header}>Henüz Kazanılmayan Başarımlar</h2>
          <div className={styles.achievementsSection}>
            {unachievedAchievements.length === 0 ? (
              <p>Tüm başarımlar kazanıldı!</p>
            ) : (
              unachievedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${styles.achievementCard} ${styles.unachieved}`}
                >
                  <div className={styles.achievementBadge}>
                    <FaStar size={40} />
                  </div>
                  <div className={styles.achievementDetails}>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.leftColumn}>
        <div className={styles.pointsRulesSection}>
          <h3>Nasıl Puan Kazanırım?</h3>
          <ul className={styles.pointsList}>
            <li>
              <FaHandsHelping /> Etkinliğe Katılım: +10 Puan
            </li>
            <li>
              <FaStar /> Etkinlik Oluşturma: +50 Puan
            </li>
            <li>
              <FaCommentDots /> Etkinliğe Yorum Yapma: +20 Puan
            </li>
          </ul>
        </div>

        <div className={styles.rankingContainer}>
          <h3>Sıralama</h3>
          {allUsersRanked.length > 0 ? (
            <div className={styles.rankingContainer}>
              {allUsersRanked.map((user, index) => (
                <div key={user.id} className={styles.rankingItem}>
                  <div className={styles.rankingNumber}>{index + 1}</div>
                  <div className={styles.rankingName}>{user.username}</div>
                  <div className={styles.rankingPoints}>{user.points} Puan</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No users available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsAndAchievements;
