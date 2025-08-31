"use client";

import { useAuth } from "@/context/AuthContext";

export function usePermissions() {
  const { user } = useAuth();

  const permissions = {
    // Ketua: hanya bisa lihat (read-only)
    ketua: {
      canView: true,
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canPrint: true,
    },
    // Sekretaris: full access
    sekretaris: {
      canView: true,
      canAdd: true,
      canEdit: true,
      canDelete: true,
      canPrint: true,
    },
  };

  const getUserRole = () => {
    if (!user || !user.role) return null;
    return user.role;
  };

  const getUserPermissions = () => {
    const role = getUserRole();
    if (!role) return null;
    return permissions[role] || null;
  };

  const canPerformAction = (action) => {
    const userPermissions = getUserPermissions();
    if (!userPermissions) return false;
    return userPermissions[action] || false;
  };

  const canView = () => canPerformAction('canView');
  const canAdd = () => canPerformAction('canAdd');
  const canEdit = () => canPerformAction('canEdit');
  const canDelete = () => canPerformAction('canDelete');
  const canPrint = () => canPerformAction('canPrint');

  return {
    user,
    role: getUserRole(),
    permissions: getUserPermissions(),
    canView,
    canAdd,
    canEdit,
    canDelete,
    canPrint,
    canPerformAction,
  };
}

export default usePermissions;
