import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./AddEvent.module.css";
import BackButton from "../../components/BackButton/BackButton";

export default function AddEvent() {
  const token = localStorage.getItem("token");

  const categories = [
    { label: "Teknoloji", value: "Technology" },
    { label: "Sanat", value: "Art" },
    { label: "Müzik", value: "Music" },
    { label: "Doğa", value: "Nature" },
    { label: "Yemek", value: "Cooking" },
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      date: "",
      time: "",
      description: "",
      location: "",
      category: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Bu alan boş bırakılamaz!"),
      date: Yup.string().required("Bu alan boş bırakılamaz!"),
      time: Yup.string().required("Bu alan boş bırakılamaz!"),
      description: Yup.string()
        .min(10, "Açıklama çok kısa.")
        .required("Bu alan boş bırakılamaz!"),
      location: Yup.string().required("Bu alan boş bırakılamaz!"),
      category: Yup.string().required("Bu alan boş bırakılamaz!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/events/create",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          alert("Etkinlik başarıyla oluşturuldu!");
          resetForm();
        }
      } catch (error) {
        console.error("Etkinlik oluşturulurken bir hata oluştu.", error);
        alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    },
  });

  return (
    <>
      <div className={styles.container}>
        <BackButton />
        <h1>Etkinlik Oluştur</h1>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Etkinlik Adı</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.name && formik.errors.name
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.name && formik.errors.name && (
              <div className={styles.errorText}>{formik.errors.name}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Tarih</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.date && formik.errors.date
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.date && formik.errors.date && (
              <div className={styles.errorText}>{formik.errors.date}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time">Saat</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.time && formik.errors.time
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.time && formik.errors.time && (
              <div className={styles.errorText}>{formik.errors.time}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Konum</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.location && formik.errors.location
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.location && formik.errors.location && (
              <div className={styles.errorText}>{formik.errors.location}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.category && formik.errors.category
                  ? styles.errorInput
                  : ""
              }
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className={styles.errorText}>{formik.errors.category}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.description && formik.errors.description
                  ? styles.errorInput
                  : ""
              }
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className={styles.errorText}>
                {formik.errors.description}
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            Etkinlik Oluştur
          </button>
        </form>
      </div>
    </>
  );
}
