import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TransactionHistoryProps {
  transactions: Transaction[];
  studentName?: string;
}

const getVisualsByType = (type: Transaction["type"]) => {
  const isIngreso = type === "recompensa" || type === "nota";
  return {
    icon: isIngreso ? (
      <ArrowUpCircle className="h-5 w-5 text-success" />
    ) : (
      <ArrowDownCircle className="h-5 w-5 text-destructive" />
    ),
    badgeVariant: isIngreso ? "default" : "destructive",
    prefix: isIngreso ? "+" : "-",
  };
};

export function TransactionHistory({
  transactions,
  studentName,
}: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No hay transacciones aún</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-h-[500px] sm:max-h-[600px] overflow-y-auto">
      <CardHeader className="sticky top-0 bg-background z-10">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Transacciones
          {studentName && (
            <span className="text-sm font-normal truncate">
              - {studentName}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const { icon, badgeVariant, prefix } = getVisualsByType(
              transaction.type
            );
            return (
              <div
                key={transaction._id || transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <p className="font-medium break-words">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(transaction.date),
                        "dd MMM yyyy, HH:mm",
                        { locale: es }
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={badgeVariant} className="text-sm">
                    {prefix}
                    {transaction.amount} coins
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
