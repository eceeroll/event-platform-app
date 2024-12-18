import React, { useState } from "react";
import axios from "axios";
import styles from "./EventCard.module.css";
import Modal from "react-modal";
import { FaStar } from "react-icons/fa";

interface EventCardProps {
  event: {
    id: number;
    name: string;
    category: string;
    creator: {
      firstName: string;
      lastName: string;
    };
    personalized: boolean;
    description: string;
    location: string;
    date: string;
    time: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleJoinEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/events/join/${event.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalMessage(response.data.message);
      setIsModalOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setModalMessage(err.response?.data?.message || "Bir hata oluştu.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className={styles["event-card"]}>
      {/* flag for reccommended event */}
      {event.personalized && (
        <div className={styles.personalizedBadge}>
          <FaStar className={styles.starIcon} size={20} color="gold" />
          <span className={styles.personalizedText}>
            İlgi Alanlarınızla Eşleşiyor
          </span>
        </div>
      )}
      <h2>{event.name}</h2>

      <div className={styles["event-details"]}>
        <p>
          <strong>Tür:</strong> {event.category}
        </p>
        <p>
          <strong>Konum:</strong> {event.location}
        </p>
        <p>
          <strong>Tarih:</strong> {event.date}
        </p>
        <p>
          <strong>Saat:</strong> {event.time}
        </p>
      </div>
      <p>
        <strong>Düzenleyen:</strong> {event.creator.firstName}{" "}
        {event.creator.lastName}
      </p>
      <p className={styles.description}>
        <strong>Açıklama:</strong> {event.description}
      </p>

      <div className={styles["event-footer"]}>
        <button>Katılımcıları görüntüle</button>
        <button onClick={handleJoinEvent} className={styles["join-button"]}>
          Etkinliğe katıl
        </button>
      </div>

      <Modal
        className={styles["react-modal"]}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <h3>{modalMessage}</h3>
        <button onClick={() => setIsModalOpen(false)}>Kapat</button>
      </Modal>
    </div>
  );
};

export default EventCard;
