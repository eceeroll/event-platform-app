import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../../components/EventCard/EventCard";
import styles from "./HomePage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { Event } from "../../types/Event";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(null);
  const currentUser = JSON.parse(localStorage.getItem("user")!);
  const [events, setEvents] = useState<Event[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/events/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data.events);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Emin misiniz?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      navigate("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileMenu}>
        <div className={styles.profileInfo} onClick={toggleMenu}>
          <FaUser className={styles.profileIcon} size={20} />
          {currentUser.firstName} {currentUser.lastName}
        </div>
        <div
          className={
            isMenuOpen
              ? `${styles.dropdownMenu} ${styles.active}`
              : styles.dropdownMenu
          }
        >
          <Link to="/profile">Profilim</Link>
          <Link to="/change-password">Şifre Yenile</Link>
          <Link to="/rewards">Puan ve Başarımlar</Link>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
      </div>
      <h1>Anasayfa</h1>
      <div className={styles.eventButtonGroup}>
        <button
          onClick={() => navigate("/new-event")}
          className={styles.eventButton}
        >
          Yeni Etkinlik Oluştur
        </button>
        <button
          onClick={() => navigate("/manage-events")}
          className={styles.eventButton}
        >
          Etkinlikleri Yönet
        </button>
      </div>

      <div className={styles["event-list"]}>
        {loading && <p>Etkinlikler yükleniyor...</p>}
        {error && (
          <p className={styles.error}>
            {error.message || "Bilinmeyen bir hata oluştu."}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p>Gösterilecek etkinlik yok.</p>
        )}

        {!loading && !error && (
          <>
            {events
              .filter((event) => event.personalized)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </>
        )}

        {!loading && !error && (
          <>
            {events
              .filter((event) => !event.personalized)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
