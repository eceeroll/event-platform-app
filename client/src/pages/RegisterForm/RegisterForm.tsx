import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";

import styles from "./RegisterForm.module.css";

const categories = [
  { label: "Teknoloji", value: "Technology" },
  { label: "Sanat", value: "Art" },
  { label: "Müzik", value: "Music" },
  { label: "Doğa", value: "Nature" },
  // { label: "Yemek", value: "Cooking" },
];

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Bu alan boş bırakılamaz!"),
  surname: Yup.string().required("Bu alan boş bırakılamaz!"),
  email: Yup.string()
    .email("Geçersiz email!")
    .required("Bu alan boş bırakılamaz!"),
  username: Yup.string()
    .required("Bu alan boş bırakılamaz!")
    .min(6, "Kullanıcı adı en az 6 karakterden oluşmalı."),
  password: Yup.string()
    .required("Parola giriniz!")
    .min(8, "Parola en az 8 karakterden oluşmalı."),
  re_password: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Parolalar eşleşmiyor!"
  ),
  birthDate: Yup.date().required("Bu alan boş bırakılamaz!"),
  gender: Yup.string().required("Bu alan boş bırakılamaz!!"),
  interests: Yup.array()
    .min(1, "En az bir ilgi alanı seçmelisiniz!")
    .required("Bu alan boş bırakılamaz!"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Geçerli bir telefon numarası giriniz!")
    .required("Bu alan boş bırakılamaz!"),
  city: Yup.string().required("Bu alan boş bırakılamaz!"),
});

export default function RegisterForm() {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      re_password: "",
      birthDate: "",
      city: "",
      interests: [] as string[],
      gender: "",
      phoneNumber: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/register",
          {
            firstName: values.name,
            lastName: values.surname,
            username: values.username,
            password: values.password,
            email: values.email,
            role: "user",
            phoneNumber: values.phoneNumber,
            city: values.city,
            gender: values.gender,
            interests: values.interests,
            birthDate: values.birthDate,
          }
        );
        if (response.status === 201) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("Kayıt sırasında bir hata oluştu:", error);
      }
    },
  });

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {!isRegistered ? (
        <form onSubmit={formik.handleSubmit}>
          <div className={styles["sub-container"]}>
            <h2 className={styles.title}>Üyelik Formu</h2>

            <div className={styles.inputGroup}>
              <label htmlFor="name">
                <b>İsim</b>
              </label>
              <input
                type="text"
                placeholder="İsim"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                className={
                  formik.touched.name && formik.errors.name
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.name && formik.errors.name ? (
                <div className={styles.errorText}>{formik.errors.name}</div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="surname">
                <b>Soy İsim</b>
              </label>
              <input
                type="text"
                placeholder="Soy İsim"
                name="surname"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.surname}
                className={
                  formik.touched.surname && formik.errors.surname
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.surname && formik.errors.surname ? (
                <div className={styles.errorText}>{formik.errors.surname}</div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="username">
                <b>Kullanıcı Adı</b>
              </label>
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
                className={
                  formik.touched.username && formik.errors.username
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.username && formik.errors.username ? (
                <div className={styles.errorText}>{formik.errors.username}</div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">
                <b>E-posta Adresi</b>
              </label>
              <input
                type="email"
                placeholder="E-posta adresi"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                className={
                  formik.touched.email && formik.errors.email
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <div className={styles.errorText}>{formik.errors.email}</div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">
                <b>Parola oluşturun</b>
              </label>
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={
                  formik.touched.password && formik.errors.password
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <div className={styles.errorText}>{formik.errors.password}</div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="re_password">
                <b>Parola (tekrar) </b>
              </label>
              <input
                type="password"
                name="re_password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.re_password}
                className={
                  formik.touched.re_password && formik.errors.re_password
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.re_password && formik.errors.re_password ? (
                <div className={styles.errorText}>
                  {formik.errors.re_password}
                </div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="birthDate">
                <b>Doğum Tarihi</b>
              </label>
              <input
                type="date"
                name="birthDate"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.birthDate}
                className={
                  formik.touched.birthDate && formik.errors.birthDate
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.birthDate && formik.errors.birthDate ? (
                <div className={styles.errorText}>
                  {formik.errors.birthDate}
                </div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="gender">
                <b>Cinsiyet</b>
              </label>
              <select
                name="gender"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.gender}
                className={
                  formik.touched.gender && formik.errors.gender
                    ? styles.errorInput
                    : ""
                }
              >
                <option value="" label="Seçiniz" />
                <option value="male" label="Erkek" />
                <option value="female" label="Kadın" />
              </select>
              {formik.touched.gender && formik.errors.gender ? (
                <div className={styles.errorText}>{formik.errors.gender}</div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label>
                <b>İlgi Alanları</b>
              </label>
              <div className={styles.checkboxGroup}>
                {categories.map((category) => (
                  <label key={category.value} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="interests"
                      value={category.value}
                      onChange={(e) => {
                        const selected = formik.values.interests;
                        if (e.target.checked) {
                          formik.setFieldValue("interests", [
                            ...selected,
                            e.target.value,
                          ]);
                        } else {
                          formik.setFieldValue(
                            "interests",
                            selected.filter((item) => item !== e.target.value)
                          );
                        }
                      }}
                      checked={formik.values.interests.includes(category.value)} // category.value yerine category kullanıyordunuz, bunu category.value ile değiştirdik
                    />
                    {category.label}
                  </label>
                ))}
              </div>
              {formik.touched.interests && formik.errors.interests ? (
                <div className={styles.errorText}>
                  {formik.errors.interests}
                </div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">
                <b>Telefon Numarası</b>
              </label>
              <input
                type="text"
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                className={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className={styles.errorText}>
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="city">
                <b>Şehir</b>
              </label>
              <input
                type="text"
                name="city"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.city}
                className={
                  formik.touched.city && formik.errors.city
                    ? styles.errorInput
                    : ""
                }
              />
              {formik.touched.city && formik.errors.city ? (
                <div className={styles.errorText}>{formik.errors.city}</div>
              ) : null}
            </div>

            <button type="submit">Kayıt Ol</button>
          </div>

          <div className={styles.direct}>
            <span>Zaten üye misiniz? </span>
            <Link to="/login">Giriş Yapın</Link>
          </div>
        </form>
      ) : (
        <div className={styles.successMessage}>
          <h2>Üyeliğiniz başarıyla oluşturuldu!</h2>
          <p>Lütfen giriş yapınız</p>
          <button onClick={handleRedirect}>Giriş Yap</button>
        </div>
      )}
    </div>
  );
}
