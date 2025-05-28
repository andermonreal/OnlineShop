import { useState, useEffect } from "react";
import { getUserRoles, changePassword } from "../services/userService";

export default function useProfile(user) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getUserRoles()
        .then(setRoles)
        .catch(() => setRoles([]));
    }, []);

  const handleChangePasswordClick = () => {
    setError("");
    setSuccess("");
    setIsChangingPassword(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    else if (name === "newPassword1") setNewPassword1(value);
    else if (name === "newPassword2") setNewPassword2(value);
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setOldPassword("");
    setNewPassword1("");
    setNewPassword2("");
    setError("");
  };

  const handlePasswordSubmit = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword1 || !newPassword2) {
      setError("Please fill all password fields");
      return;
    }
    if (newPassword1 !== newPassword2) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword1.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword(user.id, oldPassword, newPassword1);
      setSuccess("Password changed successfully!");
      handleCancelPasswordChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    isChangingPassword,
    oldPassword,
    newPassword1,
    newPassword2,
    error,
    success,
    loading,
    isAdmin: roles.includes("admin"),
    handleChangePasswordClick,
    handlePasswordSubmit,
    handleInputChange,
    handleCancelPasswordChange,
  };
}
