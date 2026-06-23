"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { deleteBuilding } from "@/services/buildings";

interface DeleteButtonProps {
  id: string;
  onDelete?: (id: string) => Promise<void> | void;
}

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      if (onDelete) {
        await onDelete(id);
      } else {
        await deleteBuilding(id);
      }

      router.push("/admin/buildings?status=deleted");
      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao remover a edificação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        aria-label="Remover edificação"
        className="rounded-lg bg-red-500/10 p-2 transition-colors hover:bg-red-500/20 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-red-500">
          {isLoading ? "hourglass_empty" : "delete"}
        </span>
      </button>
      {errorMessage && <p className="text-right text-xs text-red-400">{errorMessage}</p>}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Excluir edificação?"
        description="Esta ação removerá a edificação do painel administrativo e não poderá ser desfeita."
        isConfirming={isLoading}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
