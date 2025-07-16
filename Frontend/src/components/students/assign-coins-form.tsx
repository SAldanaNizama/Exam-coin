import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssignCoinsData, Student } from "@/types";
import { Coins, Trophy } from "lucide-react";

interface AssignCoinsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignCoinsData) => Promise<void>;
  student: Student | null;
  isLoading?: boolean;
}

export function AssignCoinsForm({
  isOpen,
  onClose,
  onSubmit,
  student,
  isLoading,
}: AssignCoinsFormProps) {
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setGrade("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !grade) return;

    const gradeNumber = parseFloat(grade);
    if (isNaN(gradeNumber) || gradeNumber < 0 || gradeNumber > 100) return;

    await onSubmit({ studentId: student._id, grade: gradeNumber });
    onClose();
  };

  const calculateCoins = (gradeValue: number): number => {
    return Math.floor(gradeValue / 10); // ← usa la misma lógica que el backend
  };

  const gradeNumber = parseFloat(grade) || 0;
  const estimatedCoins = calculateCoins(gradeNumber);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Asignar ExamCoins
          </DialogTitle>
        </DialogHeader>

        {student && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Estudiante:</p>
              <p className="font-semibold">
                {student.firstName} {student.lastName}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Nota (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Ej: 85"
                />
              </div>

              {gradeNumber > 0 && (
                <div className="flex items-center justify-center gap-2 p-3 bg-coin/10 rounded-lg">
                  <Coins className="h-5 w-5 text-coin" />
                  <span className="font-semibold">
                    Coins a otorgar: {estimatedCoins}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!grade || isLoading || gradeNumber <= 0}
                  className="flex-1"
                >
                  {isLoading ? "Asignando..." : "Asignar"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
