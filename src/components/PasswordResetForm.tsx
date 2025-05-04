import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { put } from "../utils/api";
import toast from "react-hot-toast";

const PasswordResetForm = () => {
  const userId = useSelector((state: any) => state.users.currentUser.id);
  const token = useSelector((state: any) => state.auth.token);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Password is required")
        .min(8, "Must be at least 8 characters")
        .max(16, "Must be 16 characters or less")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[@$!%*#?&]/, "Must contain at least one special character"),
      confirmPassword: Yup.string()
        .required("Confirm your password")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await put(
          "/user/password",
          {
            newPassword: values.newPassword,
            userId,
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
        toast.success("Password updated successfully!");

        resetForm();
      } catch (error: any) {
        console.error("Failed to update password:", error);
        toast.error("Error updating password.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-primary">Reset Password</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
              formik.touched.newPassword && formik.errors.newPassword
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-primary"
            }`}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.newPassword}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-primary"
            }`}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition"
        >
          {formik.isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
