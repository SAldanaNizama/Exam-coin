import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductData } from "@/types";
import { Plus } from "lucide-react";

interface ProductFormProps {
  onSubmit: (data: CreateProductData) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim() || !stock) return;

    const priceNumber = parseInt(price);
    const stockNumber = parseInt(stock);

    if (
      isNaN(priceNumber) ||
      isNaN(stockNumber) ||
      priceNumber <= 0 ||
      stockNumber <= 0
    )
      return;

    await onSubmit({
      name: name.trim(),
      price: priceNumber,
      description: description.trim(),
      stock: stockNumber,
    });

    setName("");
    setPrice("");
    setDescription("");
    setStock("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Nuevo Producto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nombre del Producto</Label>
              <Input
                id="productName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lápiz especial"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio (coins)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del producto..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Inicial</Label>
            <Input
              id="stock"
              type="number"
              min="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Ej: 20"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creando..." : "Crear Producto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
