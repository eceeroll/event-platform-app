import styles from "./ChangePassword.module.css";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import BackButton from "../../components/BackButton/BackButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const token = localStorage.getItem("token");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Şifre görünürlüğü için state
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/users/change-password`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Şifre Başarıyla Değiştirildi!");
        setTimeout(() => setSuccessMessage(""), 2000);
        setErrorMessage("");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle errors from the API
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Şifre değiştirirken bir hata oluştu.");
      }
    }
  };

  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Bu alan boş bırakılamaz"),
      newPassword: Yup.string()
        .min(8, "Parola en az 8 karakterden oluşmalıdır")
        .required("Bu alan boş bırakılamaz"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Parolalar eşleşmiyor!")
        .required("Bu alan boş bırakılamaz"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div className={styles.changePasswordContainer}>
      <BackButton />
      <h1>Şifre Yenile</h1>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      <form onSubmit={formik.handleSubmit}>
        {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
          <div key={field} className={styles.inputGroup}>
            <input
              type={
                showPassword[field as keyof typeof showPassword]
                  ? "text"
                  : "password"
              }
              name={field}
              placeholder={
                field === "oldPassword"
                  ? "Eski Şifre"
                  : field === "newPassword"
                  ? "Yeni Şifre"
                  : "Yeni Şifre (Tekrar)"
              }
              value={formik.values[field as keyof ChangePasswordFormValues]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={styles.input}
            />
            <span
              onClick={() =>
                togglePasswordVisibility(field as keyof typeof showPassword)
              }
              className={styles.eyeIcon}
            >
              {showPassword[field as keyof typeof showPassword] ? (
                <FaEye />
              ) : (
                <FaEyeSlash />
              )}
            </span>
            {formik.errors[field as keyof ChangePasswordFormValues] &&
            formik.touched[field as keyof ChangePasswordFormValues] ? (
              <div className={styles.errorText}>
                {formik.errors[field as keyof ChangePasswordFormValues]}
              </div>
            ) : null}
          </div>
        ))}
        <button type="submit" className={styles.changeButton}>
          Şifreyi Yenile
        </button>
      </form>
    </div>
  );
}
