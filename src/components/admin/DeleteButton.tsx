"use client";

import { useState } from "react";

interface DeleteButtonProps {
  id: string;
  onDelete?: (id: string) => void;
}

export default function DeleteButton({
  id,
  onDelete,
}: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta edificação?"
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      // Futuramente você poderá integrar com o backend:
      // await deleteEdificacao(id);

      console.log("Edificação removida:", id);

      if (onDelete) {
        onDelete(id);
      }

      alert("Edificação removida com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao remover a edificação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isLoading}
      aria-label="Remover edificação"
      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-red-500">
        {isLoading ? "hourglass_empty" : "delete"}
      </span>
    </button>
  );
}