/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from "../../types/Event";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./ManageEvents.module.css";
import BackButton from "../../components/BackButton/BackButton";

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const createdResponse = await axios.get(
          "http://localhost:3000/events/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEvents(createdResponse.data);

        const joinedResponse = await axios.get(
          "http://localhost:3000/events/joined",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setJoinedEvents(joinedResponse.data.events);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Bilinmeyen bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const openDetailsModal = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedEvent(null);
    setIsDetailsModalOpen(false);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      await axios.put(
        `http://localhost:3000/events/update/${selectedEvent.id}`,
        selectedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Etkinlik başarıyla güncellendi!");

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...selectedEvent } : event
        )
      );

      closeModal();
    } catch (err: any) {
      alert("Güncelleme başarısız: " + (err.message || "Bilinmeyen bir hata"));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selectedEvent) return;
    setSelectedEvent({ ...selectedEvent, [e.target.name]: e.target.value });
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/events/delete/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Etkinlik başarıyla silindi!");
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (err: any) {
      alert(
        "Silme işlemi başarısız: " + (err.message || "Bilinmeyen bir hata")
      );
    }
  };

  const handleLeaveEvent = async (eventId: number) => {
    try {
      await axios.delete(`http://localhost:3000/events/leave/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Etkinlikten ayrıldınız!");
      setJoinedEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (err: any) {
      console.log(err);
      alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz");
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <h1>Etkinliklerim</h1>
      {loading && <p>Yükleniyor...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && (
        <div className={styles.splitContainer}>
          <div className={styles.column}>
            <h2>Oluşturduğum Etkinlikler</h2>
            <div className={styles.eventList}>
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className={styles.eventItem}>
                    <span>{event.name}</span>
                    <div className={styles.iconGroup}>
                      <FaEdit
                        className={styles.editIcon}
                        onClick={() => openModal(event)}
                      />
                      <FaTrash
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteEvent(event.id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Henüz etkinlik oluşturmadınız.</p>
              )}
            </div>
          </div>

          <div className={styles.column}>
            <h2>Katıldığım Etkinlikler</h2>
            <div className={styles.eventList}>
              {joinedEvents.length > 0 ? (
                joinedEvents.map((event) => (
                  <div key={event.id} className={styles.eventItem}>
                    <span>{event.name}</span>
                    <div className={styles.iconGroup}>
                      <button
                        className={styles.leaveButton}
                        onClick={() => handleLeaveEvent(event.id)}
                      >
                        İptal Et
                      </button>
                      <button
                        className={styles.detailsButton}
                        onClick={() => openDetailsModal(event)}
                      >
                        Detayları Gör
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Henüz hiçbir etkinliğe katılmadınız.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal - Etkinlik düzenleme*/}
      {isModalOpen && selectedEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Etkinlik Düzenle</h2>
            <form onSubmit={handleUpdateEvent}>
              {/* Inputlar */}
              <label>
                Başlık:
                <input
                  type="text"
                  name="name"
                  value={selectedEvent.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Tarih:
                <input
                  type="date"
                  name="date"
                  value={selectedEvent.date}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Saat:
                <input
                  type="time"
                  name="time"
                  value={selectedEvent.time}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Konum:
                <input
                  type="text"
                  name="location"
                  value={selectedEvent.location}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Açıklama:
                <textarea
                  name="description"
                  value={selectedEvent.description}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Kaydet</button>
              <button type="button" onClick={closeModal}>
                İptal
              </button>
            </form>
          </div>
        </div>
      )}

      {/*  Modal - etkinlik detayları */}
      {isDetailsModalOpen && selectedEvent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Etkinlik Detayları</h2>
            <p>
              <strong>Başlık:</strong> {selectedEvent.name}
            </p>
            <p>
              <strong>Tarih:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Saat:</strong> {selectedEvent.time}
            </p>
            <p>
              <strong>Konum:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Açıklama:</strong> {selectedEvent.description}
            </p>
            <button className={styles.closeButton} onClick={closeDetailsModal}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
