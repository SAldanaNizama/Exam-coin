import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StudentCard } from "@/components/students/student-card";
import { StudentForm } from "@/components/students/student-form";
import { AssignCoinsForm } from "@/components/students/assign-coins-form";
import { TransactionHistory } from "@/components/students/transaction-history";
import { ProductCard } from "@/components/store/product-card";
import { ProductForm } from "@/components/store/product-form";
import { studentsApi, storeApi } from "@/lib/api";
import { Student, Transaction, Product } from "@/types";
import { GraduationCap, Store, Users, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAssignCoins, setShowAssignCoins] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTeacher, setIsTeacher] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [studentsData, productsData] = await Promise.all([
        studentsApi.getAll(),
        storeApi.getProducts(),
      ]);
      setStudents(studentsData);
      setProducts(productsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (data: {
    firstName: string;
    lastName: string;
  }) => {
    setActionLoading(true);
    try {
      const newStudent = await studentsApi.create(data);
      setStudents((prev) => [...prev, newStudent]);
      toast({
        title: "¡Éxito!",
        description: `Estudiante ${data.firstName} ${data.lastName} creado correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el estudiante",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignCoins = async (data: {
    studentId: string;
    grade: number;
  }) => {
    setActionLoading(true);
    try {
      const result = await studentsApi.assignCoins(data);

      const coinsAwarded = Math.floor(data.grade / 10);

      // Update student balance
      setStudents((prev) =>
        prev.map((student) =>
          student._id === data.studentId
            ? { ...student, coins: student.coins + coinsAwarded }
            : student
        )
      );

      toast({
        title: "¡Coins asignados!",
        description: `${coinsAwarded} coins otorgados por la nota ${data.grade}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al asignar coins",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewHistory = async (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setSelectedStudent(student);
    try {
      const studentTransactions = await studentsApi.getTransactions(studentId);
      setTransactions(studentTransactions);
      setShowHistory(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar el historial",
        variant: "destructive",
      });
    }
  };

  const handleCreateProduct = async (data: {
    name: string;
    price: number;
    description: string;
    stock: number;
  }) => {
    setActionLoading(true);
    try {
      const newProduct = await storeApi.createProduct(data);
      setProducts((prev) => [...prev, newProduct]);
      toast({
        title: "¡Éxito!",
        description: `Producto "${data.name}" creado correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el producto",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    setActionLoading(true);
    try {
      await storeApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "¡Éxito!",
        description: "Producto eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurchase = async (productId: string, studentId?: string) => {
    if (!studentId) return;

    setActionLoading(true);
    try {
      console.log("🛒 Comprando...", { studentId, productId });

      const result = await storeApi.purchase({ studentId, productId });
      console.log("✅ Resultado compra:", result);

      // Actualizar estudiante y producto
      setStudents((prev) =>
        prev.map((student) =>
          student._id === studentId ? result.student : student
        )
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? result.product : p))
      );

      toast({
        title: "¡Compra exitosa!",
        description: `Producto adquirido correctamente`,
      });
    } catch (error: any) {
      console.error("❌ Error en la compra:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al realizar la compra";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">ExamCoins Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isTeacher ? "default" : "outline"}
                onClick={() => setIsTeacher(true)}
                size="sm"
              >
                👨‍🏫 Profesor
              </Button>
              <Button
                variant={!isTeacher ? "default" : "outline"}
                onClick={() => setIsTeacher(false)}
                size="sm"
              >
                👨‍🎓 Estudiante
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Estudiantes
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Tienda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            {isTeacher && (
              <StudentForm
                onSubmit={handleCreateStudent}
                isLoading={actionLoading}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onViewHistory={handleViewHistory}
                  onAssignCoins={(studentId) => {
                    setSelectedStudent(
                      students.find((s) => s._id === studentId) || null
                    );
                    setShowAssignCoins(true);
                  }}
                  isTeacher={isTeacher}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            {isTeacher && (
              <ProductForm
                onSubmit={handleCreateProduct}
                isLoading={actionLoading}
              />
            )}

            {!isTeacher && students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona tu perfil para comprar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {students.map((student) => {
                      const isSelected = selectedStudent?._id === student._id;

                      return (
                        <Button
                          key={student._id}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => setSelectedStudent(student)}
                          className={`justify-start ${
                            isSelected ? "ring-2 ring-primary" : ""
                          }`}
                        >
                          {student.firstName} {student.lastName} (
                          {student.coins} coins)
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPurchase={
                    !isTeacher
                      ? (productId) =>
                          handlePurchase(productId, selectedStudent?._id)
                      : undefined
                  }
                  onDelete={isTeacher ? handleDeleteProduct : undefined}
                  canPurchase={
                    !isTeacher && selectedStudent
                      ? selectedStudent.coins >= product.price
                      : false
                  }
                  isTeacher={isTeacher}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AssignCoinsForm
        isOpen={showAssignCoins}
        onClose={() => setShowAssignCoins(false)}
        onSubmit={handleAssignCoins}
        student={selectedStudent}
        isLoading={actionLoading}
      />

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historial de Transacciones</DialogTitle>
          </DialogHeader>
          <TransactionHistory
            transactions={transactions}
            studentName={
              selectedStudent
                ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
