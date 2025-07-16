import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoinBadge } from "@/components/ui/coin-badge";
import { Student } from "@/types";
import { User, History, Coins } from "lucide-react";

interface StudentCardProps {
  student: Student;
  onViewHistory: (studentId: number) => void;
  onAssignCoins: (studentId: number) => void;
  isTeacher?: boolean;
}

export function StudentCard({
  student,
  onViewHistory,
  onAssignCoins,
  isTeacher = false,
}: StudentCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-lg">
              {student.firstName} {student.lastName}
            </span>
          </div>
          <CoinBadge amount={student.coins} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewHistory(student._id)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Ver Historial
          </Button>
          {isTeacher && (
            <Button
              size="sm"
              onClick={() => onAssignCoins(student._id)}
              className="flex items-center gap-2"
            >
              <Coins className="h-4 w-4" />
              Asignar Coins
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
