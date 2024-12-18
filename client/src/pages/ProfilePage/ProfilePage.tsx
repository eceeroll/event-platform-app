import styles from "./ProfilePage.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton/BackButton";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  birthDate: string;
  interests: string[];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")!);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    birthDate: "",
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const predefinedInterests = ["Sanat", "Teknoloji", "Müzik", "Doğa", "Yemek"];
  const [selectedInterest, setSelectedInterest] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.user);
        setUserInfo(response.data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken bir hata oluştu:", error);
      }
    };

    fetchUserInfo();
    console.log(userInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${user.id}`,
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Kullanıcı Bilgileri Başarıyla Güncellendi!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error(
        "Kullanıcı bilgileri güncellenirken bir hata oluştu:",
        error
      );
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handleAddInterest = () => {
    if (selectedInterest && !userInfo.interests.includes(selectedInterest)) {
      setUserInfo((prevState) => ({
        ...prevState,
        interests: [...prevState.interests, selectedInterest],
      }));
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      interests: prevState.interests.filter((i) => i !== interest),
    }));
  };

  if (isLoading) return <p>Loading..</p>;

  return (
    <div className={styles.profileContainer}>
      <BackButton />
      <div className={styles.header}>
        <h1>Profil Bilgileri</h1>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <div className={styles.profileDetails}>
        <label>Ad:</label>
        {isEditing ? (
          <input
            type="text"
            name="firstName"
            value={userInfo.firstName}
            onChange={handleChange}
          />
        ) : (
          <p>{userInfo.firstName}</p>
        )}

        <label>Soyad:</label>
        {isEditing ? (
          <input
            type="text"
            name="lastName"
            value={userInfo.lastName}
            onChange={handleChange}
          />
        ) : (
          <p>{userInfo.lastName}</p>
        )}

        <label>E-posta:</label>
        {isEditing ? (
          <input
            type="text"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
          />
        ) : (
          <p>{userInfo.email}</p>
        )}

        <label>Telefon Numarası:</label>
        {isEditing ? (
          <input
            type="text"
            name="phoneNumber"
            value={userInfo.phoneNumber}
            onChange={handleChange}
          />
        ) : (
          <p>{userInfo.phoneNumber}</p>
        )}

        <label>Şehir:</label>
        {isEditing ? (
          <input
            type="text"
            name="city"
            value={userInfo.city}
            onChange={handleChange}
          />
        ) : (
          <p>{userInfo.city}</p>
        )}

        <label>Doğum Tarihi:</label>
        {isEditing ? (
          <input
            type="date"
            name="birthDate"
            value={userInfo.birthDate}
            onChange={handleChange}
          />
        ) : (
          <p>{userInfo.birthDate}</p>
        )}

        <label>İlgi Alanları:</label>
        {isEditing ? (
          <div className={styles.interestsSection}>
            <ul>
              {userInfo.interests.map((interest, index) => (
                <li key={index}>
                  {interest}
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveInterest(interest)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.selectContainer}>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
              >
                <option value="">Bir ilgi alanı seçin</option>
                {predefinedInterests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
              <button
                className={styles.addButton}
                onClick={handleAddInterest}
                disabled={!selectedInterest}
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <ul>
            {userInfo.interests.map((interest, index) => (
              <li key={index}>{interest}</li>
            ))}
          </ul>
        )}
      </div>

      {isEditing ? (
        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.saveButton}>
            Kaydet
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className={styles.cancelButton}
          >
            İptal
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className={styles.editButton}
        >
          Düzenle
        </button>
      )}
    </div>
  );
}
